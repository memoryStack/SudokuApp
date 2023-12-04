type SetIntervalReturnValue = ReturnType<typeof setInterval>

type Time = {
    hours: number
    minutes: number
    seconds: number
}

type OnTimeChange = (time: Time) => void
type GetPreviousTime = () => Time

const SECONDS_IN_FULL_MINUTE = 60
const MINUTES_IN_FULL_HOUR = 60

const getNewTime = (currentTime: Time): Time => {
    let nextSecond = currentTime.seconds + 1
    let nextMinute = currentTime.minutes
    let nextHour = currentTime.hours
    if (nextSecond === SECONDS_IN_FULL_MINUTE) {
        nextMinute++
        nextSecond = 0
    }
    if (nextMinute === MINUTES_IN_FULL_HOUR) {
        nextHour++
        nextMinute = 0
    }
    return { hours: nextHour, minutes: nextMinute, seconds: nextSecond }
}

// it's more like a util class
export class Timer {
    private timerId: SetIntervalReturnValue | null

    private TIMER_INTERVAL_IN_MS: number = 1000

    onTimeChange: OnTimeChange

    getPreviousTime: GetPreviousTime

    constructor(
        onTimeChange: OnTimeChange,
        getPreviousTime: GetPreviousTime,
    ) {
        this.onTimeChange = onTimeChange
        this.getPreviousTime = getPreviousTime

        this.incrementTime = this.incrementTime.bind(this)

        this.timerId = null
    }

    incrementTime() {
        const newTime = getNewTime(this.getPreviousTime())
        this.onTimeChange(newTime)
    }

    startTimer() {
        this.timerId = setInterval(this.incrementTime, this.TIMER_INTERVAL_IN_MS)
    }

    stopTimer() {
        if (this.timerId) {
            clearInterval(this.timerId)
            this.timerId = null
        }
    }
}
