import React, { useCallback } from 'react'
import { View, Text } from 'react-native'
import { Styles, INACTIVE_ICON_FILL } from './style'
import { HintIcon } from '../../../resources/svgIcons/hint'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { emit } from '../../../utils/GlobalEventBus'
import { EVENTS, GAME_STATE } from '../../../resources/constants'
 
// TODO: i should make it as a part of settings so that users can change it according to their confidence level
// and also we can make the hints numbers vary according to the difficulty level. user can customize that as per their 
// comfort and confidence level

const Hint_ = ({ iconBoxSize, gameState, hints }) => {

    const onPress = useCallback(() => {
        if (gameState !== GAME_STATE.ACTIVE || hints <= 0) return
        emit(EVENTS.HINT_CLICKED)
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