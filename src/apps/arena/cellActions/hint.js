import React, { useCallback, useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { Styles, INACTIVE_ICON_FILL } from './style'
import { HintIcon } from '../../../resources/svgIcons/hint'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { emit, addListener, removeListener } from '../../../utils/GlobalEventBus'
import { EVENTS, GAME_STATE } from '../../../resources/constants'
import { usePrevious } from '../../../utils/customHooks'
import { isGameOver } from '../utils/util'
 
// TODO: i should make it as a part of settings so that users can change it according to their confidence level
// and also we can make the hints numbers vary according to the difficulty level. user can customize that as per their 
// comfort and confidence level
const MAX_AVAILABLE_HINTS = 3

const Hint_ = ({ iconBoxSize, gameState, numOfHints }) => {

    const [hints, setHints] = useState(numOfHints)
    const previousGameState = usePrevious(gameState)

    useEffect(() => {
        let componentUnmounted = false
        if (!componentUnmounted) setHints(numOfHints)
        return () => {
            componentUnmounted = true
        }
    }, [numOfHints])

    const onPress = useCallback(() => {
        if (gameState !== GAME_STATE.ACTIVE || hints <= 0) return
        emit(EVENTS.HINT_CLICKED)
    }, [gameState, hints])

    useEffect(() => {
        // TODO: it would be cool if i can animate the icon to show that wisdom action worked
        const handler = () => setHints(hints => hints-1)
        addListener(EVENTS.HINT_USED_SUCCESSFULLY, handler)
        return () => {
            removeListener(EVENTS.HINT_USED_SUCCESSFULLY, handler)
        }
    }, [])

    useEffect(() => {
        if (isGameOver(gameState))
            emit(EVENTS.GAME_OVER_STAT, {type: 'hintsUsed', data: MAX_AVAILABLE_HINTS - hints})
        if (gameState !== GAME_STATE.ACTIVE && previousGameState === GAME_STATE.ACTIVE) 
            emit(EVENTS.SAVE_GAME_STATE, { type: 'hints', data: hints })
    }, [gameState, hints])

    return (
        <Touchable
            style={Styles.actionContainer}
            onPress={onPress}
            touchable={TouchableTypes.opacity}
        >
            <>
                <HintIcon iconBoxSize={iconBoxSize} fill={INACTIVE_ICON_FILL} />
                {
                    gameState === GAME_STATE.ACTIVE ?
                        <View style={Styles.hintsTickerBox}>
                            <Text style={Styles.hintsTickerText}>{hints}</Text>
                        </View>
                    : null
                }
            </>
            <Text style={Styles.actionText}>{`Hint`}</Text>
        </Touchable>
    )
}

export const Hint = React.memo(Hint_)
