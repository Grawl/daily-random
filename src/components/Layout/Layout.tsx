import { type FC, type PropsWithChildren } from 'react'

import { MantineProvider } from '@mantine/core'

// instead of this:
// import '@mantine/core/styles/default-css-variables.css'
// I copy it, split, and change root color scheme selectors:
import '~/vendor/mantine/variables.css'
import '~/vendor/mantine/light.css'
import '~/vendor/mantine/dark.css'
import styles from './Layout.module.css'

export const Layout: FC<PropsWithChildren> = ({ children }) => (
	<MantineProvider
		defaultColorScheme='auto'
		withGlobalClasses={false}
		withStaticClasses={false}
	>
		<div className={styles.root}>{children}</div>
	</MantineProvider>
)
