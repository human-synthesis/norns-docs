/**
 * Markdown → HTML for docs pages. Pure: takes a markdown string, returns the
 * HTML and the heading list for the table of contents.
 *
 * - marked (GFM) for the document.
 * - shiki, fine-grained bundle with the JavaScript regex engine (no WASM),
 *   dual light/dark theme via CSS variables. `civet` code blocks use the
 *   CoffeeScript grammar until a Civet grammar exists; `.n` templates use
 *   `pug`. If the highlighter fails to load, code blocks fall back to
 *   escaped `<pre><code>`.
 * - `> [!NOTE]`-style blockquotes (also TIP, IMPORTANT, WARNING, CAUTION)
 *   become callouts.
 */
import { Marked } from 'marked';
import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

const LANG_ALIASES = {
	'': 'text',
	text: 'text',
	txt: 'text',
	plain: 'text',
	civet: 'coffee',
	coffee: 'coffee',
	coffeescript: 'coffee',
	n: 'pug',
	pug: 'pug',
	jade: 'pug',
	sh: 'shellscript',
	bash: 'shellscript',
	shell: 'shellscript',
	zsh: 'shellscript',
	js: 'javascript',
	mjs: 'javascript',
	javascript: 'javascript',
	ts: 'typescript',
	typescript: 'typescript',
	json: 'json',
	sql: 'sql',
	css: 'css',
	html: 'html',
	svelte: 'svelte',
	yaml: 'yaml',
	yml: 'yaml',
	toml: 'toml',
	md: 'markdown',
	markdown: 'markdown'
};

let highlighterPromise = null;

function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighterCore({
			themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark.mjs')],
			langs: [
				import('shiki/langs/javascript.mjs'),
				import('shiki/langs/typescript.mjs'),
				import('shiki/langs/coffee.mjs'),
				import('shiki/langs/pug.mjs'),
				import('shiki/langs/shellscript.mjs'),
				import('shiki/langs/json.mjs'),
				import('shiki/langs/sql.mjs'),
				import('shiki/langs/css.mjs'),
				import('shiki/langs/html.mjs'),
				import('shiki/langs/svelte.mjs'),
				import('shiki/langs/yaml.mjs'),
				import('shiki/langs/toml.mjs'),
				import('shiki/langs/markdown.mjs')
			],
			engine: createJavaScriptRegexEngine({ forgiving: true })
		}).catch((e) => {
			console.warn('[docs] shiki unavailable, code blocks render without highlighting:', e?.message ?? e);
			return null;
		});
	}
	return highlighterPromise;
}

/** @param {string} s */
function escapeHtml(s) {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/** GitHub-style heading ids, unique within one document. */
class Slugger {
	constructor() {
		this.seen = new Map();
	}
	/** @param {string} text */
	slug(text) {
		let base = text
			.toLowerCase()
			.trim()
			.replace(/<[^>]+>/g, '')
			.replace(/[^\p{L}\p{N}\s-]/gu, '')
			.replace(/\s+/g, '-');
		if (!base) base = 'section';
		const n = this.seen.get(base) ?? 0;
		this.seen.set(base, n + 1);
		return n === 0 ? base : `${base}-${n}`;
	}
}

/** Text content of an inline token list, for ids and the TOC. */
function plainText(tokens) {
	let out = '';
	for (const t of tokens ?? []) {
		if (t.tokens) out += plainText(t.tokens);
		else if (typeof t.text === 'string') out += t.text;
	}
	return out.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

/**
 * @param {string} markdown
 * @returns {Promise<{ html: string, headings: Array<{ depth: number, id: string, text: string }> }>}
 */
export async function renderMarkdown(markdown) {
	const hl = await getHighlighter();
	const headings = [];
	const slugger = new Slugger();

	const marked = new Marked({ gfm: true, breaks: false });
	marked.use({
		renderer: {
			heading({ tokens, depth }) {
				const inner = this.parser.parseInline(tokens);
				const text = plainText(tokens);
				const id = slugger.slug(text);
				if (depth >= 2 && depth <= 3) headings.push({ depth, id, text });
				return `<h${depth} id="${id}"><a class="heading-anchor" href="#${id}" aria-label="Link to this section">#</a>${inner}</h${depth}>\n`;
			},
			code({ text, lang }) {
				const requested = (lang || '').trim().split(/\s+/)[0].toLowerCase();
				const id = LANG_ALIASES[requested] ?? requested;
				let body = null;
				if (hl && id !== 'text' && hl.getLoadedLanguages().includes(id)) {
					try {
						body = hl.codeToHtml(text, {
							lang: id,
							themes: { light: 'github-light', dark: 'github-dark' },
							defaultColor: false
						});
					} catch {
						body = null;
					}
				}
				if (!body) body = `<pre class="shiki"><code>${escapeHtml(text)}</code></pre>`;
				return `<div class="code-block" data-lang="${escapeHtml(requested)}">${body}</div>\n`;
			},
			blockquote({ tokens }) {
				const html = this.parser.parse(tokens);
				const m = html.match(/^<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i);
				if (!m) return `<blockquote>\n${html}</blockquote>\n`;
				const kind = m[1].toLowerCase();
				const label = kind[0].toUpperCase() + kind.slice(1);
				const rest = html.slice(m[0].length);
				return `<div class="callout callout-${kind}"><p class="callout-title">${label}</p><p>${rest}</div>\n`;
			}
		}
	});

	let html = await marked.parse(markdown);
	html = html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>');
	return { html, headings };
}
