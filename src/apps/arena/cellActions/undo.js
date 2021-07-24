import React, { useCallback, useEffect } from 'react'
import { Text } from 'react-native'
import { Styles, INACTIVE_ICON_FILL } from './style'
import { UndoIcon } from '../../../resources/svgIcons/undo'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { emit, addListener, removeListener } from '../../../utils/GlobalEventBus'
import { EVENTS, GAME_STATE } from '../../../resources/constants'

const Undo_ = ({ iconBoxSize, gameState }) => {

    const onPress =  useCallback(() => {
        if (gameState !== GAME_STATE.ACTIVE) return 
        emit(EVENTS.UNDO_CLICKED)
    }, [gameState])

    useEffect(() => {
        const handler = () => {
            // TODO: animate the icon to show the user that undo happened
        }
        addListener(EVENTS.UNDO_USED_SUCCESSFULLY, handler)
        return () => {
            removeListener(EVENTS.UNDO_USED_SUCCESSFULLY, handler)
        }
    }, [])

    return (
        <Touchable
            style={Styles.actionContainer}
            onPress={onPress}
            touchable={TouchableTypes.opacity}
        >
            <UndoIcon iconBoxSize={iconBoxSize} fill={INACTIVE_ICON_FILL} />
            <Text style={Styles.actionText}>{`Undo`}</Text>
        </Touchable>
    )
}

export const Undo = React.memo(Undo_)
