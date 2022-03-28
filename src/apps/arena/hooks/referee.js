import { useRef, useState, useEffect, useCallback } from 'react'
import { LEVEL_DIFFICULTIES, EVENTS, GAME_STATE } from '../../../resources/constants'
import { addListener, emit, removeListener } from '../../../utils/GlobalEventBus'
import { isGameOver } from '../utils/util'
import { cacheGameData, GAME_DATA_KEYS } from '../utils/cacheGameHandler'
import { updateDifficultylevel, updateMistakes, updateTime, stopTimer, startTimer } from '../store/actions/refree.actions'
import { useSelector } from 'react-redux'
import { getGameState } from '../store/selectors/gameState.selectors'
import { getHintHCInfo } from '../store/selectors/smartHintHC.selectors'
import { getDifficultyLevel, getMistakes, getTime } from '../store/selectors/refree.selectors'
import { consoleLog } from '../../../utils/util'

const MISTAKES_LIMIT = 3
// TODO: change it from refree to game tracking info
const initRefereeData = (difficultyLevel = LEVEL_DIFFICULTIES.EASY) => {
    return {
        difficultyLevel,
        mistakes: 0,
        time: { hours: 0, minutes: 0, seconds: 0 },
    }
}

const useReferee = () => {
    
    const gameState = useSelector(getGameState)

    const { show: showSmartHint } = useSelector(getHintHCInfo)

    const mistakes = useSelector(getMistakes)
    const difficultyLevel = useSelector(getDifficultyLevel)
    const time = useSelector(getTime)

    const setRefereeData = ({ mistakes, difficultyLevel, time }) => {
        // TODO: maybe make another action to update all of these
        updateMistakes(mistakes)
        updateDifficultylevel(difficultyLevel)
        updateTime(time)
    }

    useEffect(() => {
        const handler = previousGameData => {
            setRefereeData(previousGameData[GAME_DATA_KEYS.REFEREE])
        }
        addListener(EVENTS.RESUME_PREVIOUS_GAME, handler)
        return () => removeListener(EVENTS.RESUME_PREVIOUS_GAME, handler)
    }, [])

    useEffect(() => {
        const handler = ({ difficultyLevel }) => {
            setRefereeData(initRefereeData(difficultyLevel))
        }
        addListener(EVENTS.START_NEW_GAME, handler)
        return () => removeListener(EVENTS.START_NEW_GAME, handler)
    }, [])

    useEffect(() => {
        const handler = () => {
            setRefereeData(initRefereeData(difficultyLevel))
        }
        addListener(EVENTS.RESTART_GAME, handler)
        return () => removeListener(EVENTS.RESTART_GAME, handler)
    }, [difficultyLevel])

    // TODO: mistakes needed for caching game data
    useEffect(() => {
        const handler = () => {
            const refereeData = {
                difficultyLevel,
                mistakes,
                time,
            }
            cacheGameData(GAME_DATA_KEYS.REFEREE, refereeData)
        }

        addListener(EVENTS.CACHE_GAME_DATA, handler)
        return () => removeListener(EVENTS.CACHE_GAME_DATA, handler)
    }, [difficultyLevel, mistakes, time])

    // hook to start timer
    useEffect(() => {
        if (gameState === GAME_STATE.ACTIVE && !showSmartHint) startTimer()
        else stopTimer()
        return () => stopTimer()
    }, [gameState, showSmartHint])

    // TODO: this will be removed in future
    useEffect(() => {
        let componentUnmounted = false
        const handler = () => {
            let totalMistakes = mistakes + 1
            if (!componentUnmounted) {
                if (totalMistakes === MISTAKES_LIMIT) {
                    // do it after a little delay
                    setTimeout(() => {
                        emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.OVER_UNSOLVED)
                    }, 500)
                }
            }
        }
        addListener(EVENTS.MADE_MISTAKE, handler)
        return () => {
            removeListener(EVENTS.MADE_MISTAKE, handler)
            componentUnmounted = true
        }
    }, [mistakes])

    return {
        MISTAKES_LIMIT,
    }
}

export { useReferee }
