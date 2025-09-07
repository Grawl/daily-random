declare module 'eslint-plugin-css-modules' {
	import { type Linter, type Rule } from 'eslint'

	export const rules: {
		'css-modules/no-unused-class': Rule.RuleModule
		'css-modules/no-undef-class': Rule.RuleModule
	}

	export const configs: {
		recommended: Linter.Config
	}

	const plugin: {
		configs: typeof configs
		rules: typeof rules
	}

	export default plugin
}
