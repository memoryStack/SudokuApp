import React, { useState, useEffect, useCallback, useRef } from 'react'
import { View, Text } from 'react-native'
import { Styles } from './style'
import { emit, addListener, removeListener } from '../../../utils/GlobalEventBus'
import { EVENTS, GAME_STATE } from '../../../resources/constants'
import { Timer } from './timer'

// get it from settings for each level
const MISTAKES_LIMIT = 3

export const GameReferee = ({ gameState }) => {

    // TODO: get the initial state from cache
    const [difficultyLevel, setDifficultyLevel] = useState('Easy')
    const [mistakes, setMistakes] = useState(0)
    
    useEffect(() => {
        const handler = () => {
            setMistakes(mistakes+1)
            if (mistakes+1 === MISTAKES_LIMIT) emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.OVER_UNSOLVED)
        }
        addListener(EVENTS.MADE_MISTAKE, handler)
        return () => {
            removeListener(EVENTS.MADE_MISTAKE, handler)
        }
    }, [mistakes])

    // EVENTS.NEW_GAME_STARTED
    useEffect(() => {
        const handler = ({ difficultyLevel }) => {
            setDifficultyLevel(difficultyLevel)
            setMistakes(0)
        }
        addListener(EVENTS.NEW_GAME_STARTED, handler)
        return () => removeListener(EVENTS.NEW_GAME_STARTED, handler)
    }, [])

    return (
        <View style={Styles.container}>
            <Text style={Styles.textStyles}>{`Mistakes: ${mistakes} / ${MISTAKES_LIMIT}`}</Text>
            <Text style={Styles.textStyles}>{`${difficultyLevel}`}</Text>
            <Timer gameState={gameState} />
        </View>
    )
}   
