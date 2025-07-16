module.exports = {
    presets: ['module:metro-react-native-babel-preset', '@babel/preset-typescript'],
    // env: {
    //     production: {
    //         plugins: [
    //             'react-native-paper/babel'
    //         ],
    //     },
    // },
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
                    '@lodash': './node_modules/my-lodash/src/utils',
                    '@ui': './src/ui',
                    '@resources': './src/resources',
                    '@adapters': './src/adapters',
                    '@domain': './src/domain',
                    '@application': './src/application',
                    '@interfaces': './src/interfaces'
                },
            },
        ],
        ["@babel/plugin-transform-private-methods", { "loose": true }]
    ],
}
