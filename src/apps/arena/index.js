import React, { useState, useCallback, useEffect } from 'react'
import { View, Text } from 'react-native'
import { Board } from './gameBoard'
import { GameReferee } from './gameReferee'
import { GAME_BOARD_WIDTH } from './gameBoard/dimensions' // make it a global constant lateron
import { Inputpanel } from './inputPanel'
import { CellActions } from './cellActions'
import { Touchable, TouchableTypes } from '../components/Touchable'
import { emit, addListener, removeListener } from '../../utils/GlobalEventBus'
import { EVENTS, LEVEL_DIFFICULTIES, GAME_STATE } from '../../resources/constants'

/**
 * sudoku game play screen
 */

export const Arena = () => {

    const [gameState, setGameState] = useState(GAME_STATE.ACTIVE) // get the initial state from previous sessison's game state

    const onPress = () => {
        // start new game
        // Sudoku board will listen to this event
        // emit(EVENTS.START_NEW_GAME, {difficultyLevel: LEVEL_DIFFICULTIES.EASY})
        emit(EVENTS.CHANGE_GAME_STATE, gameState === GAME_STATE.INACTIVE ? GAME_STATE.ACTIVE : GAME_STATE.INACTIVE)
    }

    // listen for changing game state
    useEffect(() => {
        const handler = newState => newState && setGameState(newState)
        addListener(EVENTS.CHANGE_GAME_STATE, handler)
        return () => removeListener(EVENTS.CHANGE_GAME_STATE, handler)
    }, [])

    return (
        <View style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            top: 100,
        }}> 

            <Touchable
                onPress={onPress}
                touchable={TouchableTypes.opacity}
            >    
                <View style={{ 
                        height: 50, 
                        width: 50, 
                        backgroundColor: 'blue',
                        borderWidth: 1,
                    }}
                />
            </Touchable>
            <GameReferee gameState={gameState} />
            <Board gameState={gameState} />
            <View style={{ marginVertical: 20 }}>
                <Inputpanel gameState={gameState} />
            </View>
            <CellActions gameState={gameState} />
        </View>
    )
}
