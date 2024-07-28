import { timerClickUseCase } from '@application/usecases/refree'

import { DEFAULT_STATE } from './refree.constants'

const handleTimerClick = ({ params: { dependencies } }) => {
    timerClickUseCase(dependencies)
}

const handleResetStoreState = ({ params: { dependencies } }) => {
    const { refreeRepository } = dependencies
    refreeRepository.setState(DEFAULT_STATE)
}

const ACTION_TYPES = {
    ON_TIMER_CLICK: 'ON_TIMER_CLICK',
    ON_UNMOUNT: 'ON_UNMOUNT',
    ON_GAME_STATE_CHANGED: 'ON_GAME_STATE_CHANGED'
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_TIMER_CLICK]: handleTimerClick,
    [ACTION_TYPES.ON_UNMOUNT]: handleResetStoreState,
}

export { ACTION_TYPES, ACTION_HANDLERS }
