module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./'],
                extensions: [
                    '.ios.ts',
                    '.android.ts',
                    '.ts',

                    '.ios.tsx',
                    '.android.tsx',
                    '.tsx',
                    '.jsx',
                    '.js',
                    '.json',
                ],
                alias: {
                    '@utils': './src/utils',
                    '@contexts': './src/contexts',
                    '@lodash': './node_modules/lodash/src/utils',
                    '@ui': './src/ui',
                    '@resources': './src/resources',
                    'testing-utils': './src/utils/testing/testing-utils',
                },
            },
        ],
    ],
}
