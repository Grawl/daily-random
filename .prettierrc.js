/** @type {import("prettier").Config} */
const config = {
	editorConfig: true,
	singleQuote: true,
	trailingComma: 'all',
	tabWidth: 4,
	quoteProps: 'consistent',
	printWidth: 80,
	arrowParens: 'avoid',
	semi: false,
	htmlWhitespaceSensitivity: 'css',
	jsxSingleQuote: true,
	plugins: ['prettier-plugin-css-order'],
	overrides: [
		{
			files: ['**/*.{scss,css}'],
			options: {
				order: 'concentric-css',
			},
		},
	],
}

export default config
