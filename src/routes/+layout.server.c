import { docs } from '$lib/norns/docs/server/public'

// Shell data for every page: the package list for the header and, when the
// URL is inside a package, that package's sidebar tree.
export load := page.load
	handler: ({ container, url }) =>
		d := docs container
		pkg := url.pathname.split('/')[1] ?? ''
		nav := if pkg then d.nav(pkg) else null
		{ packages: d.packages(), nav, current: pkg }
