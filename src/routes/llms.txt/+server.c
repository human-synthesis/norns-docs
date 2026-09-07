import { docs } from '$lib/norns/docs/server/public'

// llms.txt: the package list with one link per page to its Markdown twin.
export prerender := true

export GET := route
	handler: ({ container }) =>
		new Response(docs(container).llms(), { headers: { 'content-type': 'text/plain; charset=utf-8' } })
