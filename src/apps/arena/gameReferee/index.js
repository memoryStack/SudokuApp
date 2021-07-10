import React, { useState, useEffect, useCallback, useRef } from 'react'
import { View, Text } from 'react-native'
import { Styles } from './style'
import { emit, addListener, removeListener } from '../../../utils/GlobalEventBus'
import { EVENTS, GAME_STATE } from '../../../resources/constants'
import { Touchable, TouchableTypes } from '../../components/Touchable'

const getTimeComponentString = value => {
    if(value > 9) return `${value}`
    else return `0${value}`
}

const getPauseTimerIcon = () => {
    return (
        <View style={Styles.pauseTimerIconContainer}>
            <View style={[Styles.pauseButtonMiddleGap, Styles.rectangleShape]}></View>
            <View style={Styles.rectangleShape}></View>
        </View>
    )
}

const getStartTimerIcon = () => <View style={Styles.triangleShape} />

const TimerView = ({ hours, minutes, seconds, gameState }) => {        
    return (
        <View style={Styles.timeCounter}>
            <Text style={Styles.textStyles}>{`${getTimeComponentString(hours)}:`}</Text>
            <Text style={Styles.textStyles}>{`${getTimeComponentString(minutes)}:`}</Text>
            <Text style={Styles.textStyles}>{`${getTimeComponentString(seconds)}`}</Text>
            {gameState === GAME_STATE.ACTIVE ? getPauseTimerIcon() : getStartTimerIcon()}
        </View>
    )
}

const getNewTime = ({ hours, minutes, seconds }) => {
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

// TODO: there is a memory leak in this component. screenshot taken. error is related to events subscriptions in useEffect hooks
// TODO: let's have a common unique states object for all the buttons which have stated like 'ACTIVE' or 'INACTIVE'
// basically like a toggle
// TODO: maintain seperate file for Timer component. it will cause unecessary rederings for the other two componets
let timerInstances = 0
export const GameReferee = ({ gameState }) => {

    // TODO: use "usePrevious" hook to toggle timer 

    const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 })

    // TODO: get the initial state from cache
    const [difficultyLevel, setDifficultyLevel] = useState('Easy')
    const [mistakes, setMistakes] = useState(0)
    const timerId = useRef(null)
    
    // EVENTS.MADE_MISTAKE
    useEffect(() => {
        const handler = () => {
            setMistakes(mistakes+1)
        }
        addListener(EVENTS.MADE_MISTAKE, handler)
        return () => {
            removeListener(EVENTS.MADE_MISTAKE, handler)
        }
    }, [mistakes])

    // TODO: below version does't work. MUST FIND OUT WHY ??
    const updateTime = () => {
        
        setTime(time => getNewTime(time))
    }

    const startTimer = () => {
        timerInstances++
        timerId.current = setInterval(updateTime, 1000)
    }

    // use as CDM and first start the timer
    // i guess i will have to remove this because of the below reason in useEffect hook
    useEffect(() => {
        startTimer()
    }, [])

    const stopTimer = () => {
        if (timerId.current) timerId.current = clearInterval(timerId.current)
    }

    // EVENTS.NEW_GAME_STARTED
    useEffect(() => {
        const handler = ({ difficultyLevel }) => {
            setDifficultyLevel(difficultyLevel)
            setMistakes(0)
            setTime({ hours: 0, minutes: 0, seconds: 0 })
            if (!timerId.current) {
                // it might happen that timer got started on CDM and just milliseconds after that we 
                // automatically started a new game of previous solved level
                // TODO: think over the above case. i guess it would be simple if i remove startTimer from CDM
                startTimer()
            }
        }
        addListener(EVENTS.NEW_GAME_STARTED, handler)
        return () => {
            removeListener(EVENTS.NEW_GAME_STARTED, handler)
        }
    }, [])

    // i can remove this hook by using "usePrevious" hook
        // but let's do it this way for simplicity and learn "usePrevious" hook as wll to increase the understanding of hooks
    useEffect(() => {
        const handler = gameNewState =>
            gameNewState === GAME_STATE.ACTIVE ? startTimer() : stopTimer()
        addListener(EVENTS.CHANGE_GAME_STATE, handler)
        return () => {
            removeListener(EVENTS.CHANGE_GAME_STATE, handler)
        }
    }, [])

    const onTimerClicked = () => {
        // unclickable if the game has finished
        if (gameState !== GAME_STATE.ACTIVE && gameState !== GAME_STATE.INACTIVE) return
        let gameNewState = gameState === GAME_STATE.ACTIVE ? GAME_STATE.INACTIVE : GAME_STATE.ACTIVE
        emit(EVENTS.CHANGE_GAME_STATE, gameNewState)
    }

    const { hours, minutes, seconds } = time

    return (
        <View style={Styles.container}>
            <Text style={Styles.textStyles}>{`Mistakes: ${mistakes}`}</Text>
            <Text style={Styles.textStyles}>{`${difficultyLevel}`}</Text>
            <Touchable
                styles={Styles.timeCounter}
                onPress={onTimerClicked}
                touchable={TouchableTypes.opacity}
            >
                <TimerView
                    hours={hours}
                    minutes={minutes}
                    seconds={seconds}
                    gameState={gameState}
                />
            </Touchable>
        </View>
    )
}   
