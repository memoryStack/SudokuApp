import React, { useState, useCallback, useEffect, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { BottomDragger } from '../../components/BottomDragger'
import { Svg, Path } from 'react-native-svg'
import { RestartIcon } from '../../../resources/svgIcons/restart'
import { EVENTS, GAME_STATE, LEVEL_DIFFICULTIES } from '../../../resources/constants'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { emit, addListener, removeListener } from '../../../utils/GlobalEventBus'

// TODO: research about using "useMemo" for the functions which are rendering a view in the 
//          functional component
const LEVEL_ICON_DIMENSION = 24
const NEXT_GAME_MENU_ROW_HEIGHT = 50
const NextGameMenu_ = ({ parentHeight, gameState }) => {

    const nextGameMenuRef = useRef(null)

    // when game is solved or over, i don't want the game state to be changed
    // user should start the next game
    const onNewGameMenuOpened = useCallback(() => {
        if (gameState !== GAME_STATE.ACTIVE) return
        emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.INACTIVE)
    }, [gameState])

    // when game is solved or over, i don't want the game state to be changed
    // user should start the next game
    const onNewGameMenuClosed = useCallback((optionSelectedFromMenu = false) => {
        if (gameState !== GAME_STATE.INACTIVE) return
        !optionSelectedFromMenu && emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.ACTIVE)
    }, [gameState])

    useEffect(() => {
        const handler = () =>
            nextGameMenuRef.current && nextGameMenuRef.current.openDragger()
        addListener(EVENTS.OPEN_NEXT_GAME_MENU, handler)
        return () => removeListener(EVENTS.OPEN_NEXT_GAME_MENU, handler)
    }, [])

    const getBar = (barNum, level) => {
        const pathD = ['M', (75 + 100 * barNum), '450', 'L', (75 + 100 * barNum), (350 - 100 * barNum),
                        'A 25 25 0 0 1', (125 + 100 * barNum), (350 - 100 * barNum), 'L', (125 + 100 * barNum), '450',
                        'A 25 25 0 0 1', (75 + 100 * barNum), '450'].join(' ')

        let stroke
        let fill
        if (barNum <= level) stroke = "rgba(0, 0, 0, .5)"
        else stroke = "black"
        if (barNum > level) fill = "none"
        else fill = "black"
        return (
            <Path
                d={pathD}
                stroke={stroke}
                fill={fill}
                strokeWidth={5}
            />
        )
    }

    const getLevelIcon = (level) => {
        const childArray = []
        for(let i = 0; i < 4; i++)
            childArray.push(getBar(i, level))
        return (
            <Svg viewBox="0 0 500 500" width={LEVEL_ICON_DIMENSION} height={LEVEL_ICON_DIMENSION}>
                {childArray}
            </Svg>
        )
    }

    const nextGameMenuItemClicked = useCallback(item => {
        if (item === 'restart') emit(EVENTS.RESTART_GAME)
        else emit(EVENTS.START_NEW_GAME, {difficultyLevel: item})
        nextGameMenuRef.current && nextGameMenuRef.current.closeDragger(true)
    }, [nextGameMenuRef])

    const getNextGameMenu = () => {
        return (
            <View style={{ backgroundColor: 'white', width: '100%' }}>
                {
                    Object.keys(LEVEL_DIFFICULTIES).map((levelText, index) => {
                        return (
                            <View key={levelText}>
                                <Touchable
                                    style={{height: NEXT_GAME_MENU_ROW_HEIGHT, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',  width: '100%'}}
                                    touchable={TouchableTypes.opacity}
                                    onPress={() => nextGameMenuItemClicked(levelText)}
                                >
                                    {getLevelIcon(index)}
                                    <Text style={{ fontSize: 16, color: 'black', marginLeft: 16 }}>{levelText}</Text>
                                </Touchable>
                            </View>
                        )
                    })
                }
                <Touchable
                    style={{ height: NEXT_GAME_MENU_ROW_HEIGHT, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',  width: '100%' }}
                    touchable={TouchableTypes.opacity}
                    onPress={() => nextGameMenuItemClicked('restart')} // later on replace this string to something better
                >
                    <RestartIcon width={LEVEL_ICON_DIMENSION} height={LEVEL_ICON_DIMENSION} />
                    <Text style={{ fontSize: 16, color: 'black', marginLeft: 16 }}>{'Restart'}</Text>
                </Touchable>
            </View>
        )
    }

    return (
        <BottomDragger
            parentHeight={parentHeight}
            childrenHeight={5 * NEXT_GAME_MENU_ROW_HEIGHT} // 4 levels and 1 for restart
            headerText={'Next Game Menu'}
            onDraggerOpened={onNewGameMenuOpened}
            onDraggerClosed={onNewGameMenuClosed}
            ref={nextGameMenuRef}
        >
            {getNextGameMenu()}
        </BottomDragger>
    )
}

export const NextGameMenu = React.memo(NextGameMenu_)
