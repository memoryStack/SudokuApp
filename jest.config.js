module.exports = {
    preset: 'react-native',
    transformIgnorePatterns: [],
    setupFilesAfterEnv: [
        '@testing-library/jest-native/extend-expect',
        '<rootDir>/jestSetupFiles/mockRNSwitchComponent.js',
    ],
    moduleDirectories: [
        'node_modules',
        'src/utils/testing/',
    ],
}
