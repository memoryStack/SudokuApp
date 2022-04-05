import { GAME_STATE } from '../../../resources/constants'
import { updateGameState } from '../store/actions/gameState.actions'
import { timerClick } from '../store/actions/refree.actions'

const handleInit = () => {}

const handleTimerClick = () => {
    timerClick()
}

const handleMaxMistakesLimitReached = () => {
    updateGameState(GAME_STATE.OVER.UNSOLVED)
}

const ACTION_TYPES = {
    ON_TIMER_CLICK: 'ON_TIMER_CLICK',
    ON_INIT: 'ON_INIT',
    MAX_MISTAKES_LIMIT_REACHED: 'MAX_MISTAKES_LIMIT_REACHED',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_TIMER_CLICK]: handleTimerClick,
    [ACTION_TYPES.ON_INIT]: handleInit,
    [ACTION_TYPES.MAX_MISTAKES_LIMIT_REACHED]: handleMaxMistakesLimitReached,
}

export { ACTION_TYPES, ACTION_HANDLERS }
