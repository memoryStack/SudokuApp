import React, { useCallback } from 'react'
import { Text } from 'react-native'
import { Styles, INACTIVE_ICON_FILL } from './style'
import { EraserIcon } from '../../../resources/svgIcons/eraser'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { emit } from '../../../utils/GlobalEventBus'
import { EVENTS, GAME_STATE } from '../../../resources/constants'

const Eraser_ = ({ iconBoxSize, gameState, eventsPrefix = '' }) => {

    const onPress = useCallback(() => {
        if (gameState !== GAME_STATE.ACTIVE) return
        emit(eventsPrefix + EVENTS.ERASER_CLICKED)
    }, [gameState])

    return (
        <Touchable
            style={Styles.actionContainer}
            onPress={onPress}
            touchable={TouchableTypes.opacity}
        >
            <EraserIcon iconBoxSize={iconBoxSize} fill={INACTIVE_ICON_FILL} />
            <Text style={Styles.actionText}>{`Eraser`}</Text>
        </Touchable>
    )
}

export const Eraser = React.memo(Eraser_)
