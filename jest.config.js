module.exports = {
    preset: 'react-native',
    setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
    transformIgnorePatterns: [],
    setupFilesAfterEnv: [
        '@testing-library/jest-native/extend-expect',
        '<rootDir>/jestSetupFiles/mockRNSwitchComponent.js',
        '<rootDir>/jestSetupFiles/nativeAnimatedHelper.js',
        '<rootDir>/jestSetupFiles/i18n.js',
        '<rootDir>/jestSetupFiles/fastSudokuPuzzles.js',
    ],
    testResultsProcessor: 'jest-sonar-reporter',
    collectCoverage: true,
}
