import type { Container } from '@human-synthesis/norns/server'
import type { DocsService } from './service'

// The facade: the only file routes (and, later, other features) import.
svc := (c: Container) => c.resolve('docs.service') as DocsService

export docs := (c: Container) => {
	packages: () => svc(c).packages()
	nav: (pkg: string) => svc(c).nav(pkg)
	all: () => svc(c).all()
	page: (pkg: string, slug: string) => svc(c).page(pkg, slug)
	search: () => svc(c).search()
	llms: () => svc(c).llms()
	llmsFull: () => svc(c).llmsFull()
	sitemap: () => svc(c).sitemap()
}
