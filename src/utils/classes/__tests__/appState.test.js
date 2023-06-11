import { EVENTS } from '../../../constants/events'
import { AppState } from '../appState'

jest.mock('../platform')

const mockPlatformForIOS = () => {
    const { Platform } = require('../platform')
    Platform.isIOS.mockReturnValue(true)
    Platform.OS.mockReturnValue('ios')
}

describe('AppState native module', () => {
    test('throws exception if addListener is called with invalid eventName', () => {
        expect(() => new AppState().addListener('random event name', () => { })).toThrow(Error)
    })

    test('throws exception if addListener is called with valid eventNames for other platform', () => {
        mockPlatformForIOS()
        expect(() => new AppState().addListener(EVENTS.APP_STATE.BLUR, () => { })).toThrow(Error)
    })

    test('subscribe valid platform specific events without any error', () => {
        mockPlatformForIOS()
        new AppState().addListener(EVENTS.APP_STATE.CHANGE, () => { })
    })
})
