import { timerClick } from "../store/actions/refree.actions"




// const getNewTime = ({ hours = 0, minutes = 0, seconds = 0 }) => {
//     seconds++
//     if (seconds === 60) {
//         minutes++
//         seconds = 0
//     }
//     if (minutes === 60) {
//         hours++
//         minutes = 0
//     }
//     return { hours, minutes, seconds }
// }

// const updateTime = () => timerId.current && setTime(time => getNewTime(time))

// const startTimer = () => (timerId.current = setInterval(updateTime, 1000))

// const stopTimer = () => {
//     if (timerId.current) timerId.current = clearInterval(timerId.current)
// }

const handleInit = () => {
    
}

const handleTimerClick = () => {
    timerClick()
}

const ACTION_TYPES = {
    ON_TIMER_CLICK: 'ON_TIMER_CLICK',
    ON_INIT: 'ON_INIT',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_TIMER_CLICK]: handleTimerClick,
    [ACTION_TYPES.ON_INIT]: handleInit,
}

export {
    ACTION_TYPES,
    ACTION_HANDLERS,
}
