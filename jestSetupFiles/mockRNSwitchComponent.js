const mockComponent = require('react-native/jest/mockComponent')

jest.mock('react-native/Libraries/Components/Switch/Switch', () => ({
    default: mockComponent('react-native/Libraries/Components/Switch/Switch'),
}))
