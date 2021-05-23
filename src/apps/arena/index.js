import React, { useState, useCallback, useEffect } from 'react'
import { View, Text } from 'react-native'
import { Board } from './gameBoard'
import { GameReferee } from './gameReferee'
import { GAME_BOARD_WIDTH } from './gameBoard/dimensions' // make it a global constant lateron
import { Inputpanel } from './inputPanel'
import { CellActions } from './cellActions'
import { Touchable, TouchableTypes } from '../components/Touchable'
import { emit, addListener } from '../../utils/GlobalEventBus'
import { EVENTS, LEVEL_DIFFICULTIES } from '../../resources/constants'

/**
 * sudoku game play screen
 */

export const Arena = () => {

    // should this fuction be wrapped in useCallback ??
    const onPress = () => {
        // start new game

        // Sudoku board will listen to this event
        emit(EVENTS.START_NEW_GAME, {difficultyLevel: LEVEL_DIFFICULTIES.EASY})

    }

    const [count, setCount] = useState(0)
    useEffect(() => {
        setInterval(() => {
            setCount(count => count+1)
        }, 1000)
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
                        margin: 10,
                    }}
                />

                <Text>{count}</Text>

            </Touchable>

            {/* <Touchable
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

            </Touchable> */}

            <GameReferee />
            <Board />
            <Inputpanel />
            <CellActions />
        </View>
    )
}
