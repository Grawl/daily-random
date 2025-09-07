import { createFileRoute } from '@tanstack/react-router'

import { IndexView } from '~/views/index/Index'
import { indexViewTitle } from '~/views/index/lib'

export const Route = createFileRoute('/')({
	component: IndexView,
	ssr: true,
	head: () => ({ meta: [{ title: indexViewTitle }] }),
})
