import { docs } from '$lib/norns/docs/server/public'
import { allEntries } from '$lib/norns/docs/server/repo'

// Prerender every page that has a slug; package index pages are reached by
// crawling the header and sidebar links.
export entries := => allEntries()

export load := page.load
	handler: async ({ container, params }) =>
		doc := await docs(container).page params.package, params.slug
		throw error 404, 'No such page' unless doc
		{ doc }
