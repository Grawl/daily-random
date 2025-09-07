import { resolve } from 'node:path'

import { includeIgnoreFile } from '@eslint/compat'
import ESLint from '@eslint/js'
import commentsPlugin from '@eslint-community/eslint-plugin-eslint-comments/configs'
import reactPlugin from '@eslint-react/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import { type FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import CSSModules from 'eslint-plugin-css-modules'
import progress from 'eslint-plugin-file-progress'
import { flatConfigs as ESLintPluginImportX } from 'eslint-plugin-import-x'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import noBarrelFiles from 'eslint-plugin-no-barrel-files'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import pluginReact from 'eslint-plugin-react'
import { configs as reactHooksPlugin } from 'eslint-plugin-react-hooks'
import reactHooksAddons from 'eslint-plugin-react-hooks-addons'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'
import markdownParser from 'markdown-eslint-parser'
import { configs as TypeScriptESLintConfigs } from 'typescript-eslint'

// also using eslint-import-resolver-typescript
import globals from 'globals'

type Config = FlatConfig.Config[]

const defineConfig = (...configs: Config[]) => configs.flatMap(part => part)

const fileGlobs = {
	js: ['**/*.{js,cjs,mjs}'],
	tsx: ['**/*.tsx'],
	tstsx: ['**/*.{ts,tsx}'],
}

const onlyTypeChecked = (config: FlatConfig.Config) => ({
	...config,
	files: fileGlobs.tstsx,
})

const settings: Config = [
	progress.configs['recommended-ci'],
	{
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
			globals: {
				...globals.node,
			},
		},
	},
]

const prettier: Config = [
	prettierPlugin,
	{
		rules: {
			'prettier/prettier': 'warn',
		},
	},
	{
		files: ['**/*.md'],
		rules: { 'prettier/prettier': ['warn', { parser: 'markdown' }] },
		languageOptions: {
			parser: markdownParser,
			parserOptions: {
				extraFileExtensions: ['.md'],
			},
		},
	},
]

const js: Config = [
	ESLint.configs.recommended,
	{
		rules: {
			'linebreak-style': 'off',
			'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
			'eqeqeq': 'error',
			'object-shorthand': 'error',
			'consistent-return': 'error',
			'arrow-body-style': ['warn', 'as-needed'],
			'func-style': ['warn', 'expression'],
			'no-inner-declarations': 'error',
			'no-promise-executor-return': 'error',
			'no-self-compare': 'error',
			'no-template-curly-in-string': 'error',
			'complexity': ['warn', { max: 15, variant: 'modified' }],
			'max-depth': 'warn',
			'max-lines-per-function': [
				'warn',
				{ max: 300, skipBlankLines: true, skipComments: true },
			],
			'max-nested-callbacks': ['warn', { max: 5 }],
			'no-alert': 'warn',
			'no-else-return': 'warn',
			'no-eval': 'error',
			'no-multi-assign': 'warn',
			'no-param-reassign': 'error',
			'no-useless-rename': 'warn',
			'no-useless-return': 'warn',
		},
	},
]

const commentsConfig: Config = [
	commentsPlugin.recommended,
	{
		rules: {
			'@eslint-community/eslint-comments/require-description': 'warn',
			'@eslint-community/eslint-comments/disable-enable-pair': [
				'error',
				{ allowWholeFile: true },
			],
		},
	},
]

const ts: Config = [
	...TypeScriptESLintConfigs.strictTypeChecked.map(onlyTypeChecked),
	...TypeScriptESLintConfigs.stylisticTypeChecked.map(onlyTypeChecked),
	{
		files: fileGlobs.js,
		...TypeScriptESLintConfigs.disableTypeChecked,
	},
	{
		files: fileGlobs.tstsx,
		rules: {
			'no-debugger': 'error',
			'@typescript-eslint/no-shadow': 'error',
			'@typescript-eslint/interface-name-prefix': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/naming-convention': [
				'warn',
				{
					selector: 'variable',
					format: [
						'camelCase',
						'PascalCase',
						'snake_case',
						'UPPER_CASE',
					],
					leadingUnderscore: 'allow',
					trailingUnderscore: 'allow',
				},
				{ selector: 'property', filter: '^__html$', format: null },
			],
			'@typescript-eslint/strict-boolean-expressions': 'error',
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/no-misused-promises': [
				'error',
				{
					checksVoidReturn: {
						attributes: false,
					},
				},
			],
			'@typescript-eslint/no-invalid-void-type': 'off',
			// Interface does not satisfy the constraint Record<string, unknown>
			'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
			'@typescript-eslint/restrict-template-expressions': [
				'error',
				{
					allowAny: false,
					allowArray: false,
					allowBoolean: true,
					allowNever: false,
					allowNullish: false,
					allowNumber: true,
					allowRegExp: false,
				},
			],
			'@typescript-eslint/method-signature-style': ['error', 'property'],
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{ fixStyle: 'inline-type-imports', prefer: 'type-imports' },
			],
			'@typescript-eslint/no-unnecessary-type-parameters': 'off',
			'@typescript-eslint/no-deprecated': 'warn',
			'@typescript-eslint/no-unused-expressions': 'warn',
			'@typescript-eslint/prefer-regexp-exec': 'warn',
			'@typescript-eslint/no-unnecessary-condition': 'warn',
			'consistent-return': 'off',
			'@typescript-eslint/consistent-return': 'error',
			'@typescript-eslint/array-type': [
				'warn',
				{ default: 'array-simple' },
			],
			'@typescript-eslint/default-param-last': 'warn',
			'@typescript-eslint/max-params': 'warn',
			'@typescript-eslint/no-use-before-define': 'warn',
			'@typescript-eslint/prefer-destructuring': 'warn',
			'@typescript-eslint/require-array-sort-compare': 'warn',
		},
	},
]

const importX: Config = [
	ESLintPluginImportX.recommended,
	ESLintPluginImportX.warnings,
	ESLintPluginImportX.typescript,
	{
		rules: {
			'import-x/first': 'warn',
			'import-x/no-duplicates': 'warn',
			'import-x/no-rename-default': 'off',
			'import-x/newline-after-import': 'warn',
			'import-x/no-deprecated': 'warn',
			'import-x/no-extraneous-dependencies': 'error',
			'import-x/no-cycle': 'warn',
			'import-x/no-useless-path-segments': 'error',
		},
	},
	{
		files: ['eslint.config.ts'],
		rules: {
			'import-x/default': 'off',
		},
	},
]

const unusedImports: Config = [
	{
		files: fileGlobs.tstsx,
		plugins: {
			'unused-imports': unusedImportsPlugin,
		},
		rules: {
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'error',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_',
				},
			],
		},
	},
	{
		files: ['eslint.config.ts', '**/*.d.ts'],
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
			'unused-imports/no-unused-vars': 'off',
		},
	},
	{
		// default ordering for JS files (usually configs)
		files: fileGlobs.js,
		rules: {
			'import-x/order': 'warn',
		},
	},
]

const importSort: Config = [
	{
		files: fileGlobs.tstsx,
		plugins: {
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'simple-import-sort/imports': [
				'warn',
				{
					groups: [
						['^node'],
						['eslint'],
						[
							'^react\\u0000$', // import type {} from 'react'
							'^react$', // import {} from 'react'
						],
						['^@mantine(.*)$'],
						['^@?\\w'], // Other packages.
						['^'], // Absolute imports or not matched in another group.
						['^\\.'], // import foo from "./foo"
						['.css$'],
						['^\\.\\.'], // import foo from "../foo"
						['^\\u0000'], // import 'foo'
					],
				},
			],
			'simple-import-sort/exports': 'error',
		},
	},
]

const noBarrel: Config = [
	{
		...noBarrelFiles.flat,
		files: fileGlobs.tstsx,
		ignores: [
			'*.config.{js,ts,mjs,mts,cjs,cts}',
			'*rc.{js,ts,mjs,mts,cjs,cts}',
		],
	},
]

const imports = defineConfig(importX, unusedImports, importSort, noBarrel)

const reactPluginConfig: Config = [
	{
		files: fileGlobs.tstsx,
		settings: {
			react: {
				version: 'detect',
			},
		},
		plugins: {
			react: pluginReact,
		},
		rules: {
			'react/no-deprecated': 'error',
			'react/boolean-prop-naming': 'error',
			'react/function-component-definition': [
				'warn',
				{
					namedComponents: 'arrow-function',
					unnamedComponents: 'arrow-function',
				},
			],
			'react/self-closing-comp': 'error',
			// force `propName='value'` instead of `propName={'value'}`
			'react/jsx-curly-brace-presence': ['error', 'never'],
			'react/forward-ref-uses-ref': 'error',
		},
	},
	{
		files: fileGlobs.tstsx,
		...reactPlugin.configs['recommended-type-checked'],
	},
	{
		files: fileGlobs.tstsx,
		rules: {
			'@eslint-react/no-class-component': 'warn',
			'@eslint-react/no-complex-conditional-rendering': 'warn',
			'@eslint-react/no-useless-fragment': 'warn',
			'@eslint-react/prefer-destructuring-assignment': 'warn',
			'@eslint-react/prefer-shorthand-boolean': 'warn',
			'@eslint-react/prefer-shorthand-fragment': 'warn',
			'@eslint-react/hooks-extra/no-direct-set-state-in-use-layout-effect':
				'error',
			'@eslint-react/hooks-extra/no-unnecessary-use-callback': 'error',
			'@eslint-react/hooks-extra/no-unnecessary-use-memo': 'error',
			'@eslint-react/naming-convention/component-name': [
				'warn',
				{ rule: 'PascalCase', allowAllCaps: true },
			],
			'@eslint-react/dom/no-dangerously-set-innerhtml': 'off',
		},
	},
	{
		files: ['**/*.d.ts'],
		rules: {
			'@eslint-react/no-unused-class-component-members': 'off',
			'@eslint-react/no-class-component': 'off',
		},
	},
	{
		files: fileGlobs.tstsx,
		rules: {
			'no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: 'react',
							importNames: ['default'],
							message:
								"import React from 'react' breaks tree-shaking.",
						},
						{
							name: 'react',
							importNames: ['FunctionComponent'],
							message: 'Use FC instead of FunctionComponent.',
						},
					],
				},
			],
			'no-restricted-globals': [
				'error',
				{
					name: 'React',
					message: "Import from 'react' directly.",
				},
			],
		},
	},
]

const a11y: Config = [
	{
		files: fileGlobs.tstsx,
		...jsxA11y.flatConfigs.recommended,
	},
	{
		files: fileGlobs.tstsx,
		rules: {
			'jsx-a11y/click-events-have-key-events': 'error',
			'jsx-a11y/label-has-associated-control': 'error',
		},
	},
]

const reactHooks: Config = [
	{
		...reactHooksPlugin.recommended,
		files: fileGlobs.tstsx,
	},
	{
		files: fileGlobs.tsx,
		rules: {
			'no-restricted-syntax': [
				'error',
				{
					selector: 'TSSatisfiesExpression',
					message:
						'`satisfies` keyword breaks lint rules inside React components, please use it outside of .tsx files. React team are NOT interested in this problem: https://github.com/facebook/react/issues/26004',
				},
			],
		},
	},
	reactHooksAddons.configs.recommended,
]

const reactRefreshVite: Config = [
	{
		...reactRefreshPlugin.configs.vite,
		files: fileGlobs.tstsx,
	},
]

const cssModules: Config = [
	{
		files: fileGlobs.tstsx,
		plugins: {
			'css-modules': CSSModules,
		},
		rules: {
			'css-modules/no-unused-class': 'warn',
			'css-modules/no-undef-class': 'warn',
		},
	},
]

export default defineConfig(
	[includeIgnoreFile(resolve('.gitignore'))],
	settings,
	prettier,
	js,
	ts,
	commentsConfig,
	imports,
	reactPluginConfig,
	reactHooks,
	a11y,
	cssModules,
	reactRefreshVite,
	[
		{
			ignores: ['src/routeTree.gen.ts'],
		},
	],
)
