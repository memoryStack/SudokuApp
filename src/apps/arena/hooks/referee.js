import { useRef, useState, useEffect, useCallback } from 'react'
import { LEVEL_DIFFICULTIES, PREVIOUS_GAME, EVENTS, GAME_STATE } from '../../../resources/constants';
import { addListener, emit, removeListener } from '../../../utils/GlobalEventBus'
import { getKey } from '../../../utils/storage'
import { isGameOver } from '../utils/util';

const MISTAKES_LIMIT = 3
const initRefereeData = (level = LEVEL_DIFFICULTIES.EASY) => {
    return {
        level,
        mistakes: 0,
        time: { hours: 0, minutes: 0, seconds: 0 }
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

const useReferee = (gameState) => {
    const timerId = useRef(null)
    const { level, mistakes: defaultMistakes, time: defaultTime } = useRef(initRefereeData()).current
    const [mistakes, setMistakes] = useState(defaultMistakes)
    const [difficultyLevel, setDifficultyLevel] = useState(level)
    const [time, setTime] = useState(defaultTime)

    const setRefereeData = ({ mistakes, level, time }) => {
        setTime(time)
        setDifficultyLevel(level)
        setMistakes(mistakes)
    }

    // get values from previous game
    useEffect(async () => {
        const previousGame = await getKey(PREVIOUS_GAME)
        if (previousGame) {
            const { state, referee } = previousGame
            if (state === GAME_STATE.INACTIVE) setRefereeData(referee)
        }
    }, [])

    // restart/reset/start new game the game
    useEffect(() => {
        const handler = ({ difficultyLevel } = {}) => {
            setRefereeData(initRefereeData(difficultyLevel))
        }
        addListener(EVENTS.RESTART_GAME, handler)
        return () => removeListener(EVENTS.RESTART_GAME, handler)
    }, [])

    // cache the game's data
    useEffect(() => {

    }, [])

    const updateTime = () => timerId.current && setTime(time => getNewTime(time))

    const startTimer = () => timerId.current = setInterval(updateTime, 1000)

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
        if (gameState === GAME_STATE.ACTIVE) startTimer()
        else stopTimer()
        return () => stopTimer()
    }, [gameState])

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

export {
    useReferee
}
