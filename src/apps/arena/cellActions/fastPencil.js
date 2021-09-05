import React, { useCallback } from 'react'
import { Text } from 'react-native'
import { Styles, INACTIVE_ICON_FILL } from './style'
import { PencilIcon } from '../../../resources/svgIcons/pencil'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { emit } from '../../../utils/GlobalEventBus'
import { EVENTS, PENCIL_STATE, GAME_STATE } from '../../../resources/constants'

export const getNewPencilState = currentState => {
    if (!currentState) return PENCIL_STATE.INACTIVE
    return currentState === PENCIL_STATE.ACTIVE ? PENCIL_STATE.INACTIVE : PENCIL_STATE.ACTIVE
}

const ACTIVE_PENCIL_FILL = 'rgb(57, 91, 158)'

// TODO: use pencilState to animate the UI
const FastPencil_ = ({ iconBoxSize, gameState, pencilState }) => {
    
    const isActive = pencilState === PENCIL_STATE.ACTIVE

    const onPress = useCallback(() => {
        if (gameState !== GAME_STATE.ACTIVE) return
        // TODO: animate the icon and make some UI changes so that user knows if the pencil is active or not
        emit(EVENTS.FAST_PENCIL_CLICKED)
    }, [gameState])

    return (
        <Touchable
            style={Styles.actionContainer}
            onPress={onPress}
            touchable={TouchableTypes.opacity}
        >
            <PencilIcon iconBoxSize={iconBoxSize} fill={isActive ? ACTIVE_PENCIL_FILL : INACTIVE_ICON_FILL} />
            <Text style={[Styles.actionText, { color: isActive ? ACTIVE_PENCIL_FILL : INACTIVE_ICON_FILL } ]}>{`Fast Pencil`}</Text>
        </Touchable>
    )
}

export const FastPencil = React.memo(FastPencil_)
