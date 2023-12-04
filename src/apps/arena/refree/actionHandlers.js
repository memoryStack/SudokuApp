import { GAME_STATE } from '@resources/constants'
import { DEFAULT_STATE } from './refree.constants'
import { TimerClickUseCase } from './useCases/timerClickUseCase'

const handleTimerClick = ({ params: { dependencies } }) => {
    const { gameStateRepository } = dependencies
    TimerClickUseCase(gameStateRepository)
}

const handleMaxMistakesLimitReached = ({ params: { dependencies } }) => {
    const { gameStateRepository } = dependencies
    gameStateRepository.setGameState(GAME_STATE.OVER_UNSOLVED)
}

const handleResetStoreState = ({ params: { dependencies } }) => {
    const { refreeRepository } = dependencies
    refreeRepository.setState(DEFAULT_STATE)
}

const handleStartTimer = ({ getState }) => {
    const { timer } = getState()
    timer.startTimer()
}

const handleStopTimer = ({ getState }) => {
    const { timer } = getState()
    timer.stopTimer()
}

const ACTION_TYPES = {
    ON_TIMER_CLICK: 'ON_TIMER_CLICK',
    MAX_MISTAKES_LIMIT_REACHED: 'MAX_MISTAKES_LIMIT_REACHED',
    ON_UNMOUNT: 'ON_UNMOUNT',
    ON_START_TIMER: 'ON_START_TIMER',
    ON_STOP_TIMER: 'ON_STOP_TIMER',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_TIMER_CLICK]: handleTimerClick,
    [ACTION_TYPES.MAX_MISTAKES_LIMIT_REACHED]: handleMaxMistakesLimitReached,
    [ACTION_TYPES.ON_UNMOUNT]: handleResetStoreState,
    [ACTION_TYPES.ON_START_TIMER]: handleStartTimer,
    [ACTION_TYPES.ON_STOP_TIMER]: handleStopTimer,
}

export { ACTION_TYPES, ACTION_HANDLERS }
