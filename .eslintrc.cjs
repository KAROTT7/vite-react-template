module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	settings: {
		react: {
			version: 'detect'
		}
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended'
	],
	overrides: [],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: ['react', '@typescript-eslint'],
	rules: {
		'@typescript-eslint/no-unused-vars': 2,
		'react/react-in-jsx-scope': 0,
		'no-console': 2,
		'@typescript-eslint/no-non-null-assertion': 0,
		'@typescript-eslint/no-explicit-any': 0,
		'react/jsx-max-props-per-line': [1, { when: 'multiline' }],
		'react/jsx-indent-props': [2, 'tab'],
		'react/jsx-closing-bracket-location': [1, 'line-aligned'],
		'react/jsx-first-prop-new-line': 1,
		'object-curly-newline': [
			1,
			{
				ObjectExpression: {
					multiline: true,
					minProperties: 3
				},
				ObjectPattern: {
					multiline: true,
					minProperties: 3
				},
				ImportDeclaration: {
					multiline: true,
					minProperties: 5
				}
			}
		],
		'object-curly-spacing': [1, 'always']
	}
}
