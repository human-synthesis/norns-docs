import type { Container } from '@human-synthesis/norns/server'
import { DocsRepo } from './repo'
import { renderMarkdown } from './markdown'
import { EDIT_URL } from '../shared/site'

// Business rules for the docs content: page lookup with rendered HTML and
// prev/next links, the sidebar tree, the search index and the agent-facing
// exports (llms.txt, sitemap). Talks to the repo only; knows nothing about
// HTTP.
export class DocsService
	repo: DocsRepo
	constructor(@repo: DocsRepo)

	packages()
		@repo.packages()

	nav(pkg: string)
		@repo.tree pkg

	all()
		@repo.all()

	search()
		@repo.searchIndex()

	llms()
		@repo.llmsTxt()

	llmsFull()
		@repo.llmsFull()

	sitemap()
		@repo.sitemap()

	async page(pkg: string, slug: string)
		doc := @repo.find pkg, slug
		return null unless doc
		{ html, headings } := await renderMarkdown doc.body
		siblings := @repo.byPackage pkg
		idx := siblings.indexOf doc
		prev := if idx > 0 then siblings[idx - 1] else null
		next := if idx < siblings.length - 1 then siblings[idx + 1] else null
		meta := @repo.packages().find((p) => p.id === pkg)
		prevLink := if prev then { title: prev.title, href: prev.href } else null
		nextLink := if next then { title: next.title, href: next.href } else null
		result := {
			package: doc.package
			packageTitle: meta?.name ?? doc.package
			slug: doc.slug
			title: doc.title
			description: doc.description
			href: doc.href
			mdHref: doc.mdHref
			editHref: `${EDIT_URL}/${doc.file}`
			html: html
			headings: headings
			markdown: @repo.toMarkdown doc
			prev: prevLink
			next: nextLink
		}
		result
