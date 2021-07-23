import React, { useCallback, useState, useEffect } from 'react'
import { Text } from 'react-native'
import { Styles } from './style'
import { PencilIcon } from '../../../../resources/svgIcons/pencil'
import { Touchable, TouchableTypes } from '../../../components/Touchable'
import { emit, addListener, removeListener } from '../../../../utils/GlobalEventBus'
import { EVENTS, PENCIL_STATE, GAME_STATE } from '../../../../resources/constants'

export const getNewPencilState = currentState => {
    if (!currentState) return PENCIL_STATE.INACTIVE
    return currentState === PENCIL_STATE.ACTIVE ? PENCIL_STATE.INACTIVE : PENCIL_STATE.ACTIVE
}

// TODO: use pencilState to animate the UI
const Pencil_ = ({ iconBoxSize, gameState, pencilState }) => {
    
    const onPress = useCallback(() => {
        if (gameState !== GAME_STATE.ACTIVE) return
        // TODO: animate the icon and make some UI changes so that user knows if the pencil is active or not
        emit(EVENTS.PENCIL_CLICKED)
    }, [gameState])

    return (
        <Touchable
            style={Styles.container}
            onPress={onPress}
            touchable={TouchableTypes.opacity}
        >
            <PencilIcon iconBoxSize={iconBoxSize} />
            <Text style={Styles.textStyle}>{`Pencil`}</Text>
        </Touchable>
    )
}

export const Pencil = React.memo(Pencil_)
