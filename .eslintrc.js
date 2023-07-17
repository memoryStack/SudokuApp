module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        'jest/globals': true,
    },
    extends: ['plugin:react/recommended', 'airbnb'],
    overrides: [],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react', 'react-hooks', 'jest', 'unused-imports'],
    globals: {
        __DEV__: 'readonly',
    },
    reportUnusedDisableDirectives: true,
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        'no-underscore-dangle': 'off',
        'unused-imports/no-unused-imports': 'error',
        'max-len': 'off',
        'no-shadow': ['error', { builtinGlobals: false, allow: [''] }],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
        'import/prefer-default-export': 'off',
        'react/forbid-prop-types': 'off', // TODO: enable it in future for ease of development, take it as late-night refactoring
        'no-unused-expressions': ['error', { allowShortCircuit: true }],
        'react/function-component-definition': [
            'error',
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],
        'arrow-parens': ['error', 'as-needed'],
        'no-plusplus': 'off',
        'no-continue': 'off',
        'no-use-before-define': 'off', // couldn't make it work only for functions. so disabling it for now
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/jsx-props-no-spreading': 'off',
        // 'no-use-before-define': ['error', { functions: false }], // TODO: check how to use this rule optimally because it conflicts with "clean code" book suggestion
        'no-restricted-exports': ['error', {
            restrictedNamedExports: ['then'], // then is added becasue it was added in airbnb's eslint configs
        }],
        'no-param-reassign': 'off', // TODO: come back to this, use it judiciously
    },
    settings: {
        'import/resolver': {
            alias: {
                map: [
                    ['@utils', './src/utils'],
                    ['@contexts', './src/contexts'],
                    ['@lodash', './node_modules/lodash/src/utils'],
                    ['@ui', './src/ui'],
                    ['@resources', './src/resources'],
                    ['testing-utils', './src/utils/testing/testing-utils'],
                ],
                extensions: ['.ts', '.js', '.jsx', '.json'],
            },
        },
    },
}
