module.exports = {
	// "root": true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		ecmaVersion: 2020,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:react-hooks/recommended',
		'plugin:jsx-a11y/recommended',
		'plugin:import/warnings',
		'plugin:import/errors',
		'plugin:import/typescript',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'plugin:prettier/recommended',
	],
	plugins: [
		'react',
		'react-hooks',
		'jsx-a11y',
		'import',
		'@typescript-eslint',
		'prettier',
	],
	rules: {
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'error',
		'react/prop-types': 'off',
		'react/react-in-jsx-scope': 'off',
		'import/no-default-export': 'off',
		'import/prefer-default-export': 'off',
		'import/no-named-as-default-member': 'off',
		'import/no-duplicates': 'off',
		'space-before-function-paren': 'off',
		'arrow-parens': ['error', 'always'],
		'@typescript-eslint/no-use-before-define': 'error',
		'@typescript-eslint/quotes': [
			'error',
			'single',
			{
				avoidEscape: true,
				allowTemplateLiterals: true,
			},
		],
		'react/jsx-first-prop-new-line': [1, 'multiline'],
		'react/jsx-max-props-per-line': [1],
		'react/jsx-closing-bracket-location': [2, 'tag-aligned'],
		'max-len': [0, 80, 0, { ignoreComments: true, ignoreUrls: true }],
		'no-console': 'warn',
		'no-unused-vars': 'off',
		'import/no-unresolved': 'off',
		'@typescript-eslint/no-unused-vars': ['error'],
		'@typescript-eslint/no-var-requires': 'off',
		'react/jsx-uses-react': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'react/display-name': 'off',
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
				trailingComma: 'all',
				useTabs: true,
				semi: true,
				bracketSpacing: true,
				printWidth: 80,
				endOfLine: 'auto',
				tabWidth: 2,
				jsxSingleQuote: false,
				quoteProps: 'as-needed',
				singleAttributePerLine: true,
			},
		],
	},
	settings: {
		react: {
			version: 'detect',
		},
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			},
			webpack: {
				config: 'webpack.config.ts',
			},
			// "typescript": {
			// 	"alwaysTryTypes": true,
			// 	"paths": "./tsconfig.json"
			// }
		},
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
	},
	env: {
		browser: true,
		es6: true,
	},
};
