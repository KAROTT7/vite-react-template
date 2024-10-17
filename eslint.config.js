import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import stylisticJs from '@stylistic/eslint-plugin-js'

export default [
	{ files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
	{ ignores: ['dist/*'] },
	{
		languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		settings: { react: { version: 'detect' } }
	},
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	stylisticJs.configs['all-flat'],
	{
		//* * common rules */
		rules: {
			'no-constructor-return': 2,
			'no-duplicate-imports': 2,
			'no-promise-executor-return': 2,
			'no-self-compare': 2,
			'no-unmodified-loop-condition': 2,
			'no-unreachable': 2,
			'default-case-last': 2,
			'no-empty': 2,
			'no-empty-function': 2,
			camelcase: 2,
			'object-shorthand': 2,
			'no-else-return': 2,
			'no-useless-concat': 2,

			'@stylistic/js/semi': [2, 'never'],
			'@stylistic/js/quotes': [2, 'single', { avoidEscape: true }],
			'@stylistic/js/indent': 0,
			'@stylistic/js/padded-blocks': [2, 'never'],
			'@stylistic/js/quote-props': [2, 'as-needed'],
			'@stylistic/js/object-curly-spacing': [2, 'always'],
			'@stylistic/js/space-before-function-paren': [
				2,
				{ anonymous: 'always', named: 'never', asyncArrow: 'always' }
			],
			'@stylistic/js/function-call-argument-newline': [2, 'consistent'],
			'@stylistic/js/arrow-parens': [2, 'as-needed'],
			'@stylistic/js/array-element-newline': [2, 'consistent'],
			'@stylistic/js/wrap-regex': 0,
			'@stylistic/js/multiline-ternary': 0,
			'@stylistic/js/no-extra-parens': 0,
			'@stylistic/js/dot-location': 0,
			'@stylistic/js/implicit-arrow-linebreak': 0,
			'@stylistic/js/function-paren-newline': 0,
			'@stylistic/js/newline-per-chained-call': 0,
			'@stylistic/js/multiline-comment-style': 0,
			'@stylistic/js/no-confusing-arrow': 0,
			'@stylistic/js/object-property-newline': 0,
			'@stylistic/js/wrap-iife': [2, 'inside'],
			'@stylistic/js/array-bracket-newline': 0,
			'@stylistic/js/lines-between-class-members': [
				2,
				{
					enforce: [{ blankLine: 'always', prev: 'method', next: 'method' }]
				}
			],
			'@stylistic/js/lines-around-comment': 0,
			'@stylistic/js/semi-style': 0,
			'@stylistic/js/no-extra-semi': 0
		}
	},
	{
		//* * react rules */
		rules: {
			'react/react-in-jsx-scope': 0,
			'react/prop-types': 0,
			'react/jsx-boolean-value': [2, 'never'],
			'react/jsx-closing-bracket-location': 2,
			'react/jsx-closing-tag-location': 2,
			'react/jsx-curly-brace-presence': 2,
			'react/jsx-equals-spacing': 2,
			'react/jsx-first-prop-new-line': [2, 'multiline'],
			'react/jsx-curly-spacing': [2, { when: 'never' }],
			'react/jsx-no-useless-fragment': [2, { allowExpressions: true }],
			'react/jsx-props-no-multi-spaces': 0,
			'react/jsx-tag-spacing': 2,
			'react/jsx-wrap-multilines': 2,
			'react/prefer-stateless-function': 2,
			'react/self-closing-comp': 2,
			'react/display-name': 0
		}
	},
	{
		/** typescript rules */
		rules: {
			'@typescript-eslint/no-explicit-any': 0,
			'@typescript-eslint/no-non-null-asserted-optional-chain': 0
		}
	}
]
