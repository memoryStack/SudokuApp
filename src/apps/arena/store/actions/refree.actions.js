import { getStoreState, invokeDispatch } from '../../../../redux/dispatch.helpers'
import { GAME_STATE } from '../../../../resources/constants'
import { consoleLog } from '../../../../utils/util'
import { isGameOver } from '../../utils/util'
import { setGameState } from '../reducers/gameState.reducers'

import { resetMistakes, increaseMistakes, setMistakes, setDifficultylevel, setTime } from '../reducers/refree.reducers'
import { getGameState } from '../selectors/gameState.selectors'
import { getTime } from '../selectors/refree.selectors'

export const clearMistakes = () => invokeDispatch(resetMistakes())

// TODO: maybe change the namings
export const addMistake = () => invokeDispatch(increaseMistakes())

export const updateMistakes = mistakes => invokeDispatch(setMistakes(mistakes))

export const updateDifficultylevel = level => invokeDispatch(setDifficultylevel(level))

export const timerClick = () => {
    const gameState = getGameState(getStoreState())
    if (isGameOver(gameState)) return
    const newGameState = gameState === GAME_STATE.ACTIVE ? GAME_STATE.INACTIVE : GAME_STATE.ACTIVE
    invokeDispatch(setGameState(newGameState))
}

// TODO: are we sure these funcs belong in the actions file ??
let timerId = null

const getNewTime = ({ hours = 0, minutes = 0, seconds = 0 }) => {
    seconds++
    if (seconds === 60) {
        minutes++
        seconds = 0
    }
    if (minutes === 60) {
        hours++
        minutes = 0
    }
    return { hours, minutes, seconds }
}

export const updateTime = time => invokeDispatch(setTime(time))

const incrementTime = () => {
    const time = getTime(getStoreState())
    invokeDispatch(setTime(getNewTime(time)))
}

export const startTimer = () => {
    consoleLog('@@@@@@ start the timer')
    timerId = setInterval(incrementTime, 1000)
}

export const stopTimer = () => {
    if (timerId) timerId = clearInterval(timerId)
}
