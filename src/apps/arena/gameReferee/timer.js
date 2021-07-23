import React, { useState, useEffect, useCallback, useRef } from 'react'
import { View, Text } from 'react-native'
import { Styles } from './style'
import { EVENTS, GAME_STATE } from '../../../resources/constants'
import { emit, addListener, removeListener } from '../../../utils/GlobalEventBus'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { usePrevious } from '../../../utils/customHooks'

const getTimeComponentString = value => {
    if(value > 9) return `${value}`
    else return `0${value}`
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

const getPauseTimerIcon = () => {
    return (
        <View style={Styles.pauseTimerIconContainer}>
            <View style={[Styles.pauseButtonMiddleGap, Styles.rectangleShape]} />
            <View style={Styles.rectangleShape} />
        </View>
    )
}

const getStartTimerIcon = () => <View style={Styles.triangleShape} />

const Timer_ = ({ gameState, timeData }) => {

    const [time, setTime] = useState(timeData)
    const timerId = useRef(null)
    const previousGameState = usePrevious(gameState)

    useEffect(() => {
        let componentUnmounted = false
        if (!componentUnmounted) setTime(timeData)
        return () => {
            componentUnmounted = true
        }
    }, [timeData])

    // timer toggler based on the game state
    useEffect(() => {
        if (gameState === GAME_STATE.ACTIVE) startTimer()
        else stopTimer()
    }, [gameState])

    useEffect(() => {
        // what is the need of using usePrevious hook for first event
        // TODO: let's check
        if (gameState === GAME_STATE.OVER_SOLVED && previousGameState === GAME_STATE.ACTIVE)
            emit(EVENTS.SOLVED_PUZZLE_STAT, {type: 'time', data: {...time}})
        if (gameState !== GAME_STATE.ACTIVE && previousGameState === GAME_STATE.ACTIVE) 
            emit(EVENTS.SAVE_GAME_STATE, { type: 'time', data: {...time} })
    }, [gameState, time])

    const updateTime = () => timerId.current && setTime(time => getNewTime(time))

    const startTimer = () => {
        console.log('@@@@@ timer started')
        timerId.current = setInterval(updateTime, 1000)
    }

    const stopTimer = () => {
        console.log('@@@@@ timer stopped')
        if (timerId.current) timerId.current = clearInterval(timerId.current)
    }

    const onTimerClicked = () => {
        // unclickable if the game has finished
        if (gameState !== GAME_STATE.ACTIVE && gameState !== GAME_STATE.INACTIVE) return
        let gameNewState = gameState === GAME_STATE.ACTIVE ? GAME_STATE.INACTIVE : GAME_STATE.ACTIVE
        emit(EVENTS.CHANGE_GAME_STATE, gameNewState)
    }

    return(
        <Touchable
            style={Styles.timeCounter}
            onPress={onTimerClicked}
            touchable={TouchableTypes.opacity}
            hitSlop={{ left: 8, right: 8, bottom: 8, top: 8 }}
        >
            <Text style={Styles.textStyles}>{`${getTimeComponentString(time.hours)}:`}</Text>
            <Text style={Styles.textStyles}>{`${getTimeComponentString(time.minutes)}:`}</Text>
            <Text style={Styles.textStyles}>{`${getTimeComponentString(time.seconds)}`}</Text>
            {gameState === GAME_STATE.ACTIVE ? getPauseTimerIcon() : getStartTimerIcon()}
        </Touchable>
    )
}

export const Timer = React.memo(Timer_)
