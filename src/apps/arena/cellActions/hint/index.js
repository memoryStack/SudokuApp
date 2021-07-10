import React, { useCallback, useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { Styles } from './style'
import { HintIcon } from '../../../../resources/svgIcons/hint'
import { Touchable, TouchableTypes } from '../../../components/Touchable'
import { emit, addListener, removeListener } from '../../../../utils/GlobalEventBus'
import { EVENTS, GAME_STATE } from '../../../../resources/constants'

// TODO: i should make it as a part of settings so that users can change it according to their confidence level
// and also we can make the hints numbers vary according to the difficulty level. user can customize that as per their 
// comfort and confidence level
const MAX_AVAILABLE_HINTS = 3

const Hint_ = ({ iconBoxSize, gameState }) => {

    const [hints, setHints] = useState(MAX_AVAILABLE_HINTS) // default hints

    useEffect(() => {
        const handler = () => setHints(MAX_AVAILABLE_HINTS)
        addListener(EVENTS.NEW_GAME_STARTED, handler)
        return () => removeListener(EVENTS.NEW_GAME_STARTED, handler)
    }, [])

    const onPress = useCallback(() => {
        if (gameState !== GAME_STATE.ACTIVE) return
        emit(EVENTS.HINT_CLICKED)
    }, [gameState])

    useEffect(() => {
        // TODO: it would be cool if i can animate the icon to show that wisdom action worked
        const handler = () => setHints(hints-1)
        addListener(EVENTS.HINT_USED_SUCCESSFULLY, handler)
        return () => {
            removeListener(EVENTS.HINT_USED_SUCCESSFULLY, handler)
        }
    }, [hints])

    return (
        <Touchable
            style={Styles.container}
            onPress={onPress}
            touchable={TouchableTypes.opacity}
        >
            <>
                <HintIcon iconBoxSize={iconBoxSize} />
                {
                    true && gameState === GAME_STATE.ACTIVE ?
                        <View style={Styles.tickerBox}>
                            <Text style={Styles.tickerText}>{hints}</Text>
                        </View>
                    : null
                }
            </>
            <Text style={Styles.textStyle}>{`Hint`}</Text>
        </Touchable>
    )
}

export const Hint = React.memo(Hint_)
