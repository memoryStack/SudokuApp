jest.mock('react-native/Libraries/Components/Switch/Switch', () => {
    const mockComponent = require('react-native/jest/mockComponent')
    return {
        default: mockComponent('react-native/Libraries/Components/Switch/Switch'),
    }
})
