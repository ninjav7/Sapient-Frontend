module.exports = {
    extends: ['plugin:react/recommended', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['react-hooks'],
    rules: {
        'prettier/prettier': 'warn',
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'no-param-reassign': 'error',
        'no-unused-vars': 'error',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/prop-types': 0,
    },
    overrides: [
        {
            files: ['stories/*.stories.js'],
            rules: {
                'react-hooks/rules-of-hooks': 'off',
            },
        },
    ],
    settings: {
        react: {
            version: 'detect',
        },
    },
};
