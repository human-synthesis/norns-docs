import { docs } from '$lib/norns/docs/server/public'

// llms-full.txt: every page as Markdown in one document.
export prerender := true

export GET := route
	handler: ({ container }) =>
		new Response(docs(container).llmsFull(), { headers: { 'content-type': 'text/plain; charset=utf-8' } })
