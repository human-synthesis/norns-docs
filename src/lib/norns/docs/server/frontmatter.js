/**
 * Minimal YAML-ish frontmatter parser: a leading `---` block of `key: value`
 * lines. Enough for `title` and `description`; anything richer belongs in the
 * content model, not in the file header.
 *
 * @param {string} raw
 * @returns {{ data: Record<string, string>, body: string }}
 */
export function parseFrontmatter(raw) {
	const text = raw.replace(/^﻿/, '').replace(/\r\n/g, '\n');
	if (!text.startsWith('---\n')) return { data: {}, body: text };
	const end = text.indexOf('\n---', 4);
	if (end === -1) return { data: {}, body: text };
	const head = text.slice(4, end);
	const body = text.slice(end + 4).replace(/^\n/, '');
	/** @type {Record<string, string>} */
	const data = {};
	for (const line of head.split('\n')) {
		const m = line.match(/^([\w-]+):\s*(.*)$/);
		if (!m) continue;
		let value = m[2].trim();
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}
		data[m[1]] = value;
	}
	return { data, body };
}
