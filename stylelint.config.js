/*
Stylelint: Unknown rule block-no-redundant-nested-style-rules.
Stylelint: Unknown rule media-type-no-deprecated.
Stylelint: Unknown rule nesting-selector-no-missing-scoping-root.
Stylelint: Unknown rule no-invalid-position-declaration.
Stylelint: Unknown rule property-no-deprecated.
*/

/*
https://regex101.com/library/WfeFgL
allowing double dashes (like "foo--bar") and digits
*/
const kebabRegex = '^_?[a-z0-9]+(?:-+[a-z0-9]+)*$'

/*
https://regex101.com/library/hPo3UO
allowing sequential uppercase letters (like "getURL") and digits
*/
const camelRegex = '^([a-z\\d]+)(([A-Z\\d]+)*([a-z\\d]+)*)*$'

/**
 * @param {string} regex
 * @param {string} example
 * @return {(exceptions?: string[]) => [string, { message: (name?: string) => string }]}
 */
const caseRule = (regex, example) => exceptions => [
	exceptions === undefined ? regex : `${regex}|^(${exceptions.join('|')}).*$`,
	{
		message: name =>
			`${name === undefined ? 'this' : `"${name}"`} should be written as ${example}`,
	},
]
const camelCaseRule = caseRule(camelRegex, 'camelCase')
const kebabCaseRule = caseRule(kebabRegex, 'kebab-case')

/** @type {import('stylelint').Config} */
const config = {
	plugins: [
		'stylelint-prettier',
		'stylelint-order',
		'stylelint-color-format',
	],
	extends: [
		'stylelint-prettier/recommended',
		'stylelint-config-css-modules',
		'stylelint-config-standard',
	],
	reportDescriptionlessDisables: true,
	reportInvalidScopeDisables: true,
	reportNeedlessDisables: true,
	reportUnscopedDisables: true,
	rules: {
		// False positive: Expected "currentColor" to be "currentcolor"
		'value-keyword-case': null,
		'at-rule-empty-line-before': [
			'always',
			{
				except: ['first-nested'],
				ignore: [
					'after-comment',
					'blockless-after-same-name-blockless',
				],
				ignoreAtRules: ['else'],
			},
		],
		'color-format/format': {
			format: 'hsl',
		},
		'keyframes-name-pattern': kebabCaseRule(),
		'selector-class-pattern': camelCaseRule(['mantine', 'tabler-icon']),
		// mostly used for vendor ones, but they're inconsistent
		'custom-property-pattern': null,
		// mostly used for vendor ones, but they're inconsistent
		'selector-id-pattern': null,
		'declaration-no-important': true,
		'selector-no-vendor-prefix': true,
		// longhand is good.
		'declaration-block-no-redundant-longhand-properties': null,
		'keyframe-selector-notation':
			'percentage-unless-within-keyword-only-block',
		'selector-pseudo-class-no-unknown': true,
		'selector-pseudo-element-no-unknown': true,
	},
	overrides: [
		{
			files: ['**/*.module.css'],
			rules: {
				'selector-max-id': 0,
			},
		},
		{
			files: ['**/*.css'],
			rules: {
				'order/order': [
					'declarations',
					{
						type: 'at-rule',
						hasBlock: true,
					},
					'rules',
				],
			},
		},
	],
}

export default config
