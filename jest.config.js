module.exports = {
    preset: 'react-native',
    transformIgnorePatterns: [],
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    moduleDirectories: [
        'node_modules',
        'src/utils/testing/',
    ],
}
