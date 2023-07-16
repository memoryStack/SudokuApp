const mockComponent = require('react-native/jest/mockComponent')

jest.mock('react-native/Libraries/Components/Switch/Switch', () => ({
    default: mockComponent('react-native/Libraries/Components/Switch/Switch'),
}))

// TODO: put it in separate file
// added it to avoid Animated useNativeDriver warning
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
