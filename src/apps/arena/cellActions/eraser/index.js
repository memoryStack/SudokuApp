import React, { useCallback } from 'react'
import { Text } from 'react-native'
import { Styles } from './style'
import { EraserIcon } from '../../../../resources/svgIcons/eraser'
import { Touchable, TouchableTypes } from '../../../components/Touchable'
import { emit } from '../../../../utils/GlobalEventBus'
import { EVENTS, GAME_STATE } from '../../../../resources/constants'

const Eraser_ = ({ iconBoxSize, gameState }) => {

    // passing it as prop for let's use useCallback
    const onPress = useCallback(() => {
        // TODO: perform some kind of animation for the icon
        if (gameState !== GAME_STATE.ACTIVE) return
        emit(EVENTS.ERASER_CLICKED)
    }, [gameState])

    // TODO: listen to eraser applied successfully event and animate the icon to give user a feedback
    //         that eraser applied successfully on the cell

    return (
        <Touchable
            style={Styles.container}
            onPress={onPress}
            touchable={TouchableTypes.opacity}
        >
            <EraserIcon iconBoxSize={iconBoxSize} />
            <Text style={Styles.textStyle}>{`Eraser`}</Text>
        </Touchable>
    )
}

export const Eraser = React.memo(Eraser_)

