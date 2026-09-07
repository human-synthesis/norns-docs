import { docs } from '$lib/norns/docs/server/public'

// Client-side search index: one record per page (title, description,
// headings). Fetched once by the header search box.
export prerender := true

export GET := route
	handler: ({ container }) =>
		docs(container).search()
