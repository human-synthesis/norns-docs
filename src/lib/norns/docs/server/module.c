import type { Container } from '@human-synthesis/norns/server'
import { DocsRepo } from './repo'
import { DocsService } from './service'

// DI registrations for the docs feature. The repo is a singleton because the
// content is bundled at build time and immutable per process; the CMS phase
// binds a request-scoped D1 repo here instead.
export default (app: Container) =>
	app.single 'docs.repo', => new DocsRepo!
	app.single 'docs.service', (c: Container) => new DocsService c.resolve('docs.repo')
