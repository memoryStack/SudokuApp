import { GAME_STATE } from '@resources/constants'
import { getStoreState, invokeDispatch } from '../../../../redux/dispatch.helpers'
import { GameState } from '../../utils/classes/gameState'
import { refreeActions } from '../reducers/refree.reducers'
import { getGameState } from '../selectors/gameState.selectors'
import { getTime } from '../selectors/refree.selectors'
import { updateGameState } from './gameState.actions'

const {
    resetMistakes, increaseMistakes, setMistakes, setDifficultylevel, setTime, resetState,
} = refreeActions

export const clearMistakes = () => invokeDispatch(resetMistakes())

// TODO: maybe change the namings
export const addMistake = () => {
    invokeDispatch(increaseMistakes())
}

export const updateMistakes = mistakes => invokeDispatch(setMistakes(mistakes))

export const updateDifficultylevel = level => invokeDispatch(setDifficultylevel(level))

export const timerClick = () => {
    const gameState = getGameState(getStoreState())
    const gameStateObj = new GameState(gameState)
    if (!(gameStateObj.isGameActive() || gameStateObj.isGameInactive())) return
    const newGameState = gameStateObj.isGameActive() ? GAME_STATE.INACTIVE : GAME_STATE.ACTIVE
    updateGameState(newGameState)
}

// TODO: are we sure these funcs belong in the actions file ??
let timerId = null

const getNewTime = ({ hours = 0, minutes = 0, seconds = 0 }) => {
    let nextSecond = seconds + 1
    let nextMinute = minutes
    let nextHour = hours
    if (nextSecond === 60) {
        nextMinute++
        nextSecond = 0
    }
    if (nextMinute === 60) {
        nextHour++
        nextMinute = 0
    }
    return { hours: nextHour, minutes: nextMinute, seconds: nextSecond }
}

export const updateTime = time => invokeDispatch(setTime(time))

const incrementTime = () => {
    const time = getTime(getStoreState())
    invokeDispatch(setTime(getNewTime(time)))
}

export const startTimer = () => {
    timerId = setInterval(incrementTime, 1000)
}

export const stopTimer = () => {
    if (timerId) timerId = clearInterval(timerId)
}

export const resetStoreState = () => {
    invokeDispatch(resetState())
}
