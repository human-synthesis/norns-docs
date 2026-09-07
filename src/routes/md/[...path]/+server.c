import { docs } from '$lib/norns/docs/server/public'
import { allMdEntries } from '$lib/norns/docs/server/repo'

// Raw Markdown twin of every page, for agents and for copy/paste:
//   /md/norns.md                          the package index
//   /md/norns/runtime/container.md        a page
// The `.md` suffix keeps file and directory names apart in the prerendered
// output (an extension-less index twin would block its own children).
export prerender := true
export entries := => allMdEntries()

export GET := route
	handler: async ({ container, event }) =>
		// route() hands over `event`, not `params` (only page.load does).
		path := String(event.params.path ?? '').replace(/\.md$/, '')
		[pkg, ...rest] := path.split('/')
		doc := await docs(container).page pkg, rest.join('/')
		throw error 404, 'No such page' unless doc
		new Response(doc.markdown, { headers: { 'content-type': 'text/markdown; charset=utf-8' } })
