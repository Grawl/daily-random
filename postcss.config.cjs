module.exports = {
	plugins: {
		'postcss-dark-theme-class': {
			darkSelector: '[data-mantine-color-scheme=dark]',
			lightSelector: '[data-mantine-color-scheme=light]',
		},
		'postcss-preset-mantine': {},
		'postcss-simple-vars': {
			variables: {
				'mantine-breakpoint-xs': '36em',
				'mantine-breakpoint-sm': '48em',
				'mantine-breakpoint-md': '62em',
				'mantine-breakpoint-lg': '75em',
				'mantine-breakpoint-xl': '88em',
			},
		},
	},
}
