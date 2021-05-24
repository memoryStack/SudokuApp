import React, { useState, useEffect, useCallback, useRef } from 'react'
import { View, Text } from 'react-native'
import { Styles } from './style'
import { emit, addListener, removeListener } from '../../../utils/GlobalEventBus'
import { EVENTS } from '../../../resources/constants'
import { Touchable, TouchableTypes } from '../../components/Touchable'

const gameState = 'active'

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

const TimerView = ({ hours, minutes, seconds }) => {        
    return (
        <View style={Styles.timeCounter}>
            <Text style={Styles.textStyles}>{`${getTimeComponentString(hours)}:`}</Text>
            <Text style={Styles.textStyles}>{`${getTimeComponentString(minutes)}:`}</Text>
            <Text style={Styles.textStyles}>{`${getTimeComponentString(seconds)}`}</Text>
            {gameState === 'active' ? getPauseTimerIcon() : getStartTimerIcon()}
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

const covertTime = seconds => {
    let hours = Math.floor(seconds / 3600)
    seconds = seconds - hours * 3600
    let minutes = Math.floor(seconds / 60)
    seconds -= minutes * 60
    return { hours, minutes, seconds }
}

// TODO: let's have a common unique states object for all the buttons which have stated like 'ACTIVE' or 'INACTIVE'
// basically like a toggle
let timerInstances=0
export const GameReferee = () => {

    const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 })

    // TODO: get the initial state from cache
    const [difficultyLevel, setDifficultyLevel] = useState('Easy')
    const [mistakes, setMistakes] = useState(0)
    const timerId = useRef(null)
    const timerState = useRef('off')
    
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
        console.log('@@@@@@ timer started')
        timerInstances++
        timerId.current = setInterval(updateTime, 1000)
        timerState.current = 'on'
    }

    // use as CDM and first start the timer
    useEffect(() => {
        startTimer()
    }, [])

    const stopTimer = () => {
        if (timerId.current) timerId.current = clearInterval(timerId.current)
        timerState.current = 'off'
    }

    // EVENTS.NEW_GAME_STARTED
    useEffect(() => {
        const handler = ({ difficultyLevel }) => {
            /**
             * 1. reset mistakes count
             * 2. update difficulty level
             * 3. reset timer
             */
            setDifficultyLevel(difficultyLevel)
            setMistakes(0)
            setTime({ hours: 0, minutes: 0, seconds: 0 })
            console.log('@@@@@@@ STARTED NEW GAME')
            if (!timerId.current) {
                // it might happen that timer got started on CDM and just milliseconds after that we 
                // automatically started a new game of previous solved level
                startTimer()
            }
        }
        addListener(EVENTS.NEW_GAME_STARTED, handler)
        return () => {
            removeListener(EVENTS.NEW_GAME_STARTED, handler)
        }
    }, [])
    
    // TODO: learn how to setup redux and reducers
    const onTimerClicked = () => {
        /**
         * 1. predict the new state based on the current state 
         * 2. toggle timer accordingly
         * 3. emit the event for game new state
         */
        
        timerState.current === 'on' ? stopTimer() : startTimer()
    }

    const { hours, minutes, seconds } = time
    // console.log('@@@@@@', hours, minutes, seconds)
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
                />
            </Touchable>
        </View>
    )
}   
