import { createRouter as createTanStackRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'

export const createRouter = () =>
	createTanStackRouter({
		routeTree,
		defaultPreload: 'intent',
		defaultErrorComponent: error => <p>{error.error.stack}</p>,
		defaultNotFoundComponent: () => <p>not found</p>,
		scrollRestoration: true,
	})

declare module '@tanstack/react-router' {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- overload
	// @ts-expect-error
	type Register = {
		router: ReturnType<typeof createRouter>
	}
}
