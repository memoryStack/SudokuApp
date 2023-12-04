import { Timer } from '../timer'

describe('Timer', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    test('will call onTimeChange() function after 1 second added to time returned by getPreviousTime() function', () => {
        const onTimeChange = jest.fn()
        const getPreviousTime = jest.fn().mockReturnValue({ hours: 0, minutes: 0, seconds: 0 })

        const timer = new Timer(onTimeChange, getPreviousTime)
        timer.startTimer()

        jest.advanceTimersByTime(1000)

        expect(onTimeChange).toHaveBeenCalledWith({ hours: 0, minutes: 0, seconds: 1 })
    })

    test('will call getPreviousTime() and onTimeChange() after every second until timer is stopped', () => {
        const onTimeChange = jest.fn()
        const getPreviousTime = jest.fn().mockReturnValue({ hours: 0, minutes: 0, seconds: 0 })

        const timer = new Timer(onTimeChange, getPreviousTime)
        timer.startTimer()

        jest.advanceTimersByTime(1000)
        jest.advanceTimersByTime(1000)
        jest.advanceTimersByTime(1000)

        timer.stopTimer()

        // these calls have no effect once timer is stopped
        jest.advanceTimersByTime(1000)
        jest.advanceTimersByTime(1000)
        jest.advanceTimersByTime(1000)

        expect(onTimeChange).toHaveBeenCalledTimes(3)
        expect(getPreviousTime).toHaveBeenCalledTimes(3)
    })

    test('onTimeChange() will be called with minutes increased by 1 if previous time was the 2nd last second of the minute', () => {
        const onTimeChange = jest.fn()
        const getPreviousTime = jest.fn().mockReturnValue({ hours: 0, minutes: 0, seconds: 59 })

        const timer = new Timer(onTimeChange, getPreviousTime)
        timer.startTimer()
        jest.advanceTimersByTime(1000)

        expect(onTimeChange).toHaveBeenCalledWith({ hours: 0, minutes: 1, seconds: 0 })
    })

    test('onTimeChange() will be called with hours increased by 1 if previous time was 2nd last second of the hour', () => {
        const onTimeChange = jest.fn()
        const getPreviousTime = jest.fn().mockReturnValue({ hours: 0, minutes: 59, seconds: 59 })

        const timer = new Timer(onTimeChange, getPreviousTime)
        timer.startTimer()
        jest.advanceTimersByTime(1000)

        expect(onTimeChange).toHaveBeenCalledWith({ hours: 1, minutes: 0, seconds: 0 })
    })
})
