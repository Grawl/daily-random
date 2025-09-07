/// <reference types="vite/client" />
import { type FC, type PropsWithChildren } from 'react'

import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'

import faviconICO from '~/assets/favicon.ico?url'
import faviconSVG from '~/assets/favicon.svg?url'
import { Layout } from '~/components/Layout/Layout'

import rootStyles from './root.css?url'

const RootDocument: FC<PropsWithChildren> = ({ children }) => (
	<html lang='en'>
		<head>
			<HeadContent />
		</head>
		<body>
			<Layout>{children}</Layout>
			<TanStackRouterDevtools position='bottom-left' />
			<Scripts />
		</body>
	</html>
)

const RootComponent: FC = () => (
	<RootDocument>
		<NuqsAdapter>
			<Outlet />
		</NuqsAdapter>
	</RootDocument>
)

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				name: 'robots',
				content: 'noindex',
			},
		],
		links: [
			{ rel: 'stylesheet', href: rootStyles },
			{ rel: 'icon', href: faviconSVG, type: 'image/svg+xml' },
			{ rel: 'icon', href: faviconICO },
		],
	}),
	component: RootComponent,
})
