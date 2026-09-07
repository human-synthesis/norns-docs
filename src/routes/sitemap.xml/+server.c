import { docs } from '$lib/norns/docs/server/public'

export prerender := true

export GET := route
	handler: ({ container }) =>
		new Response(docs(container).sitemap(), { headers: { 'content-type': 'application/xml; charset=utf-8' } })
