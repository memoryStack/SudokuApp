jest.mock('react-native/Libraries/Components/Switch/Switch', () => {
    const mockComponent = require('react-native/jest/mockComponent')
    return {
        default: mockComponent('react-native/Libraries/Components/Switch/Switch'),
    }
})

// TODO: put it in separate file
// added it to avoid Animated useNativeDriver warning
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
