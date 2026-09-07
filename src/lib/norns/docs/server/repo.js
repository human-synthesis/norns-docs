/**
 * DocsRepo — the content source.
 *
 * v1 reads markdown files under `content/<package>/...` that Vite bundles at
 * build time through `import.meta.glob` (no filesystem access at runtime, so
 * the same code runs under Node prerendering and on Cloudflare Workers).
 * The CMS phase swaps this class for a D1-backed repo with the same method
 * surface; the service, facade and routes do not change.
 *
 * File layout → URL:
 *   content/norns/index.md                          → /norns
 *   content/norns/10-getting-started/index.md       → /norns/getting-started
 *   content/norns/10-getting-started/20-install.md  → /norns/getting-started/install
 *
 * The numeric `NN-` prefix orders sections and pages and is stripped from
 * the slug. `index.md` is the page for its folder. Frontmatter carries
 * `title` and `description`.
 */
import { parseFrontmatter } from './frontmatter.js';
import { PACKAGES } from '../shared/packages.js';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../shared/site.js';

const files = import.meta.glob('/content/**/*.md', { query: '?raw', import: 'default', eager: true });

const ORDER_RE = /^(\d+)-/;

/** @param {string} seg */
function segment(seg) {
	const m = seg.match(ORDER_RE);
	return { order: m ? Number(m[1]) : 9999, slug: seg.replace(ORDER_RE, '') };
}

/** @param {string} slug */
function titleFrom(slug) {
	const last = slug.split('/').pop() ?? '';
	const words = last.replace(/-/g, ' ').trim();
	return words ? words[0].toUpperCase() + words.slice(1) : '';
}

/**
 * Sort by the numeric prefixes, shortest path first so an index page precedes
 * the pages inside its folder.
 */
function compareOrder(a, b) {
	const n = Math.max(a.order.length, b.order.length);
	for (let i = 0; i < n; i++) {
		const x = a.order[i] ?? -1;
		const y = b.order[i] ?? -1;
		if (x !== y) return x - y;
	}
	return a.slug.localeCompare(b.slug);
}

/** @param {string} body */
function headingsOf(body) {
	const out = [];
	const re = /^#{2,3}\s+(.+?)\s*#*\s*$/gm;
	let m;
	while ((m = re.exec(body)) !== null) out.push(m[1].replace(/[`*_]/g, ''));
	return out;
}

function buildPages() {
	const pages = [];
	for (const [path, raw] of Object.entries(files)) {
		const rel = path.replace(/^\/content\//, '').replace(/\.md$/, '');
		const segs = rel.split('/');
		const pkg = segs.shift();
		if (!pkg || pkg.startsWith('_')) continue;
		const isIndex = segs[segs.length - 1] === 'index';
		if (isIndex) segs.pop();
		const parts = segs.map(segment);
		const slug = parts.map((p) => p.slug).join('/');
		const { data, body } = parseFrontmatter(String(raw));
		pages.push({
			package: pkg,
			slug,
			file: `${rel}.md`,
			isIndex,
			depth: parts.length,
			order: parts.map((p) => p.order),
			section: parts.length > 0 ? parts[0].slug : '',
			title: data.title ?? titleFrom(slug || pkg),
			description: data.description ?? '',
			body,
			href: slug ? `/${pkg}/${slug}` : `/${pkg}`,
			mdHref: slug ? `/md/${pkg}/${slug}.md` : `/md/${pkg}.md`
		});
	}
	pages.sort(compareOrder);
	return pages;
}

const ALL = buildPages();

const link = (p) => ({ title: p.title, href: p.href, description: p.description });

/**
 * Prerender entries for the `[package]/[...slug]` routes: every page that has
 * a slug (index pages are reached by crawling the nav).
 */
export function allEntries() {
	return ALL.filter((p) => p.slug).map((p) => ({ package: p.package, slug: p.slug }));
}

/** Prerender entries for the `/md/[...path]` twins: every page, index pages included. */
export function allMdEntries() {
	return ALL.map((p) => ({ path: p.mdHref.replace(/^\/md\//, '') }));
}

export class DocsRepo {
	all() {
		return ALL;
	}

	/** @param {string} pkg */
	byPackage(pkg) {
		return ALL.filter((p) => p.package === pkg);
	}

	/** @param {string} pkg @param {string} slug */
	find(pkg, slug) {
		const s = (slug ?? '').replace(/\/+$/, '');
		return ALL.find((p) => p.package === pkg && p.slug === s) ?? null;
	}

	packages() {
		return PACKAGES.map((p) => ({
			...p,
			href: `/${p.id}`,
			pages: ALL.filter((d) => d.package === p.id).length
		}));
	}

	/**
	 * Sidebar tree for one package: top-level pages, then sections with their
	 * pages. A section without an `index.md` gets a synthesised title and links
	 * to its first page.
	 *
	 * @param {string} pkg
	 */
	tree(pkg) {
		const meta = PACKAGES.find((p) => p.id === pkg);
		const pages = this.byPackage(pkg);
		if (!meta && pages.length === 0) return null;
		const root = pages.find((p) => p.depth === 0);
		const sections = new Map();
		const top = [];
		for (const p of pages) {
			if (p.depth === 0) continue;
			if (p.depth === 1 && !p.isIndex) {
				top.push(link(p));
				continue;
			}
			let s = sections.get(p.section);
			if (!s) {
				s = { slug: p.section, title: titleFrom(p.section), href: null, pages: [] };
				sections.set(p.section, s);
			}
			if (p.depth === 1 && p.isIndex) {
				s.title = p.title;
				s.href = p.href;
			} else {
				s.pages.push(link(p));
			}
		}
		for (const s of sections.values()) {
			if (!s.href) s.href = s.pages[0]?.href ?? `/${pkg}`;
		}
		return {
			id: pkg,
			title: meta?.name ?? titleFrom(pkg),
			href: `/${pkg}`,
			description: meta?.description ?? root?.description ?? '',
			pages: top,
			sections: [...sections.values()]
		};
	}

	/** Client-side search index: one compact record per page. */
	searchIndex() {
		return ALL.map((p) => ({
			package: p.package,
			title: p.title,
			href: p.href,
			description: p.description,
			text: `${p.title} ${p.description} ${headingsOf(p.body).join(' ')}`.toLowerCase()
		}));
	}

	/** The page as standalone Markdown (served at its `/md/...` twin). */
	toMarkdown(doc) {
		const head = `# ${doc.title}\n\n`;
		const lede = doc.description ? `> ${doc.description}\n\n` : '';
		return `${head}${lede}${doc.body.trim()}\n`;
	}

	llmsTxt() {
		const out = [`# ${SITE_NAME}`, '', `> ${SITE_DESCRIPTION}`, ''];
		out.push(
			'Every page below is served as Markdown at the listed URL; the HTML version is the same path without the `/md` prefix. The full corpus is at `/llms-full.txt`.',
			''
		);
		for (const pkg of PACKAGES) {
			const pages = this.byPackage(pkg.id);
			if (pages.length === 0) continue;
			out.push(`## ${pkg.name}${pkg.npm ? ` (${pkg.npm})` : ''}`, '');
			out.push(pkg.description, '');
			for (const p of pages) {
				const desc = p.description ? `: ${p.description}` : '';
				out.push(`- [${p.title}](${SITE_URL}${p.mdHref})${desc}`);
			}
			out.push('');
		}
		return out.join('\n');
	}

	llmsFull() {
		const out = [`# ${SITE_NAME} — full corpus`, '', `> ${SITE_DESCRIPTION}`, ''];
		for (const p of ALL) {
			out.push('', '---', '', `<!-- ${SITE_URL}${p.href} -->`, '');
			out.push(this.toMarkdown(p).trimEnd());
		}
		return out.join('\n') + '\n';
	}

	sitemap() {
		const urls = ['/', ...ALL.map((p) => p.href)];
		const body = urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n');
		return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
	}
}
