module.exports = {
    preset: 'react-native',
    transformIgnorePatterns: [],
    setupFilesAfterEnv: [
        '@testing-library/jest-native/extend-expect',
        '<rootDir>/jestSetupFiles/mockRNSwitchComponent.js',
        '<rootDir>/jestSetupFiles/gestureMock.js',
    ],
}
