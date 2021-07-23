import React, { useState, useEffect, useCallback, useRef } from 'react'
import { View, Text } from 'react-native'
import { Styles } from './style'
import { emit, addListener, removeListener } from '../../../utils/GlobalEventBus'
import { EVENTS, GAME_STATE } from '../../../resources/constants'
import { Timer } from './timer'
import { usePrevious } from '../../../utils/customHooks'

// get it from settings for each level
const MISTAKES_LIMIT = 3

export const GameReferee = ({ gameState, refereeData }) => {

    const [difficultyLevel, setDifficultyLevel] = useState(refereeData.level)
    const [mistakes, setMistakes] = useState(refereeData.mistakes)
    const previousGameState = usePrevious(gameState)

    useEffect(() => {
        let componentUnmounted = false
        if (!componentUnmounted) {
            const { level, mistakes } = refereeData
            setDifficultyLevel(level)
            setMistakes(mistakes)
        }
        return () => {
            componentUnmounted = true
        }
    }, [refereeData])

    useEffect(() => {
        let componentUnmounted = false
        const handler = () => {
            let totalMistakes
            if (!componentUnmounted) setMistakes(mistakes => totalMistakes = mistakes + 1)
            if (totalMistakes === MISTAKES_LIMIT) emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.OVER_UNSOLVED)
        }
        addListener(EVENTS.MADE_MISTAKE, handler)
        return () => {
            removeListener(EVENTS.MADE_MISTAKE, handler)
            componentUnmounted = true
        }
    }, [])
    
    useEffect(() => {
        if (gameState === GAME_STATE.OVER_SOLVED) {
        // if (gameState === GAME_STATE.OVER_SOLVED && previousGameState === GAME_STATE.ACTIVE) {
            // why there is use of using usePrevious hook ?
            // isn't simply listening to gameState enough ??
            emit(EVENTS.SOLVED_PUZZLE_STAT, {type: 'difficultyLevel', data: difficultyLevel}) // this info is already in Arena
            emit(EVENTS.SOLVED_PUZZLE_STAT, {type: 'mistakes', data: mistakes})
        }
        if (gameState !== GAME_STATE.ACTIVE && previousGameState === GAME_STATE.ACTIVE) 
            emit(EVENTS.SAVE_GAME_STATE, { type: 'mistakes', data: mistakes })
    }, [gameState, difficultyLevel, mistakes])

    return (
        <View style={Styles.container}>
            <Text style={Styles.textStyles}>{`Mistakes: ${mistakes} / ${MISTAKES_LIMIT}`}</Text>
            <Text style={Styles.textStyles}>{`${difficultyLevel}`}</Text>
            <Timer gameState={gameState} timeData={refereeData.time} />
        </View>
    )
}   
