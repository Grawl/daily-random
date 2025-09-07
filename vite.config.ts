import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

import { mantineAutoloadCSS } from 'unplugin-mantine-autoload-css'

export default defineConfig(({ mode }) => {
	const { VITE_SERVER_PORT, VITE_SERVER_HOST, VITE_BASE } = loadEnv(mode, '')
	return {
		base: VITE_BASE,
		server: {
			port: Number(VITE_SERVER_PORT),
		},
		build: {
			sourcemap: mode !== 'production',
		},
		css: {
			modules: {
				// Change `__` underscores to `--` dashes
				// for double-click selection of class part from devtools
				generateScopedName:
					mode === 'development'
						? '[name]--[local]--[hash:base64:5]'
						: '[hash:base64:5]',
			},
		},
		plugins: [
			tsConfigPaths({
				projects: ['./tsconfig.json'],
			}),
			mantineAutoloadCSS({
				global: true,
				baseline: true,
				defaultCSSVariables: false,
				allDependencies: false,
				forced: ['UnstyledButton', 'Input', 'InlineInput', 'Popover'],
			}),
			tanstackStart({
				customViteReactPlugin: true,
				sitemap: {
					host: VITE_SERVER_HOST,
				},
				pages: [
					{
						path: VITE_BASE ?? '/',
						prerender: {
							enabled: true,
							crawlLinks: true,
						},
					},
				],
			}),
			react(),
		],
	}
})
