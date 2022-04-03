import { timerClick } from '../store/actions/refree.actions'

const handleInit = () => {}

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

export { ACTION_TYPES, ACTION_HANDLERS }
