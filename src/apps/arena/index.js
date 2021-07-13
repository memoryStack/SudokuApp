import React, { useState, useCallback, useEffect, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Board } from './gameBoard'
import { GameReferee } from './gameReferee'
import { GAME_BOARD_WIDTH } from './gameBoard/dimensions' // make it a global constant lateron
import { Inputpanel } from './inputPanel'
import { CellActions } from './cellActions'
import { Touchable, TouchableTypes } from '../components/Touchable'
import { emit, addListener, removeListener } from '../../utils/GlobalEventBus'
import { EVENTS, GAME_STATE, LEVEL_DIFFICULTIES } from '../../resources/constants'
import { Page } from '../components/Page'
import { NextGameMenu } from './nextGameMenu'

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
})

export const Arena = () => {

    const [gameState, setGameState] = useState(GAME_STATE.ACTIVE) // get the initial state from previous sessison's game state
    const [pageHeight, setPageHeight] = useState(0)

    const onPress = () => {
        emit(EVENTS.CHANGE_GAME_STATE, gameState === GAME_STATE.INACTIVE ? GAME_STATE.ACTIVE : GAME_STATE.INACTIVE)
    }

    // listen for changing game state. and it should be o;ly one listener through out the App
    useEffect(() => {
        const handler = newState => newState && setGameState(newState)
        addListener(EVENTS.CHANGE_GAME_STATE, handler)
        return () => removeListener(EVENTS.CHANGE_GAME_STATE, handler)
    }, [])

    useEffect(() => {
        const handler = () => gameState !== GAME_STATE.ACTIVE && setGameState(GAME_STATE.ACTIVE)
        addListener(EVENTS.NEW_GAME_STARTED, handler)
        return () => removeListener(EVENTS.NEW_GAME_STARTED, handler)
    }, [gameState])

    return (
        <Page>
            <View style={styles.container} 
                onLayout={({ nativeEvent: { layout: { height = 0 } = {} } = {} }) => {
                    setPageHeight(height)
                }}
            >
                <Touchable
                    onPress={onPress}
                    touchable={TouchableTypes.opacity}
                >    
                    <View 
                        style={{ 
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
                {pageHeight ? <NextGameMenu parentHeight={pageHeight} /> : null}
            </View>
        </Page>
    )
}
