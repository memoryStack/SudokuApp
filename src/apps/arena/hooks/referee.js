import { useRef, useState, useEffect, useCallback } from 'react'
import { LEVEL_DIFFICULTIES, EVENTS, GAME_STATE } from '../../../resources/constants'
import { addListener, emit, removeListener } from '../../../utils/GlobalEventBus'
import { isGameOver } from '../utils/util'
import { cacheGameData, GAME_DATA_KEYS } from '../utils/cacheGameHandler'

const MISTAKES_LIMIT = 3
// TODO: change it from refree to game tracking info
const initRefereeData = (difficultyLevel = LEVEL_DIFFICULTIES.EASY) => {
    return {
        difficultyLevel,
        mistakes: 0,
        time: { hours: 0, minutes: 0, seconds: 0 },
    }
}

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

const useReferee = (gameState, showSmartHint) => {
    const timerId = useRef(null)
    const {
        difficultyLevel: defaultDifficultyLevel,
        mistakes: defaultMistakes,
        time: defaultTime,
    } = useRef(initRefereeData()).current
    const [mistakes, setMistakes] = useState(defaultMistakes)
    const [difficultyLevel, setDifficultyLevel] = useState(defaultDifficultyLevel)
    const [time, setTime] = useState(defaultTime)

    const setRefereeData = ({ mistakes, difficultyLevel, time }) => {
        setTime(time)
        setDifficultyLevel(difficultyLevel)
        setMistakes(mistakes)
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

    const updateTime = () => timerId.current && setTime(time => getNewTime(time))

    const startTimer = () => (timerId.current = setInterval(updateTime, 1000))

    const stopTimer = () => {
        if (timerId.current) timerId.current = clearInterval(timerId.current)
    }

    const onTimerClick = useCallback(() => {
        // un-clickable if the game has finished
        if (isGameOver(gameState)) return
        const gameNewState = gameState === GAME_STATE.ACTIVE ? GAME_STATE.INACTIVE : GAME_STATE.ACTIVE
        emit(EVENTS.CHANGE_GAME_STATE, gameNewState)
    }, [gameState])

    // hook to start timer
    useEffect(() => {
        if (gameState === GAME_STATE.ACTIVE && !showSmartHint) startTimer()
        else stopTimer()
        return () => stopTimer()
    }, [gameState, showSmartHint])

    // on mistake is made
    useEffect(() => {
        let componentUnmounted = false
        const handler = () => {
            let totalMistakes = mistakes + 1
            if (!componentUnmounted) {
                setMistakes(totalMistakes)
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
        mistakes,
        time,
        difficultyLevel,
        onTimerClick,
    }
}

export { useReferee }