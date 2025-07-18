module.exports = {
    preset: 'react-native',
    setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
    transformIgnorePatterns: [],
    setupFilesAfterEnv: [
        '@testing-library/jest-native/extend-expect',
        '<rootDir>/jestSetupFiles/mockRNSwitchComponent.js',
        '<rootDir>/jestSetupFiles/nativeAnimatedHelper.js',
        '<rootDir>/jestSetupFiles/i18n.js',
        '<rootDir>/jestSetupFiles/recyclerlistview.js',
        '<rootDir>/jestSetupFiles/reactNativeSound.js',
    ],
    testEnvironmentOptions: {
        customExportConditions: [''],
    },
    testResultsProcessor: 'jest-sonar-reporter',
    moduleDirectories: ['node_modules', '<rootDir>/'],
    "moduleNameMapper": {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|lottie)$": "<rootDir>/jestSetupFiles/fileMock.js",
    }
    // collectCoverage: true,
}
