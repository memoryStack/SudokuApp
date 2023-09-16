import { GAME_STATE } from '@resources/constants'
import { updateGameState } from '../store/actions/gameState.actions'
import { resetStoreState, timerClick } from '../store/actions/refree.actions'

const handleTimerClick = ({ params: gameState }) => {
    timerClick(gameState)
}

const handleMaxMistakesLimitReached = () => {
    updateGameState(GAME_STATE.OVER.UNSOLVED)
}

const handleResetStoreState = () => {
    resetStoreState()
}

const ACTION_TYPES = {
    ON_TIMER_CLICK: 'ON_TIMER_CLICK',
    MAX_MISTAKES_LIMIT_REACHED: 'MAX_MISTAKES_LIMIT_REACHED',
    ON_UNMOUNT: 'ON_UNMOUNT',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_TIMER_CLICK]: handleTimerClick,
    [ACTION_TYPES.MAX_MISTAKES_LIMIT_REACHED]: handleMaxMistakesLimitReached,
    [ACTION_TYPES.ON_UNMOUNT]: handleResetStoreState,
}

export { ACTION_TYPES, ACTION_HANDLERS }
