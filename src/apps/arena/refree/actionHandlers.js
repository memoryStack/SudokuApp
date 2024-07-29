import { timerClickUseCase } from '@application/usecases/refree'

const handleTimerClick = ({ params: { dependencies } }) => {
    timerClickUseCase(dependencies)
}

const ACTION_TYPES = {
    ON_TIMER_CLICK: 'ON_TIMER_CLICK',
    ON_GAME_STATE_CHANGED: 'ON_GAME_STATE_CHANGED'
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_TIMER_CLICK]: handleTimerClick,
}

export { ACTION_TYPES, ACTION_HANDLERS }
