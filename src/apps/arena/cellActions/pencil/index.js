import React, { useCallback, useState } from 'react'
import { Text } from 'react-native'
import { Styles } from './style'
import { PencilIcon } from '../../../../resources/svgIcons/pencil'
import { Touchable, TouchableTypes } from '../../../components/Touchable'
import { emit } from '../../../../utils/GlobalEventBus'
import { EVENTS, PENCIL_STATE } from '../../../../resources/constants'

export const getNewPencilState = currentState => {
    if (!currentState) return PENCIL_STATE.INACTIVE
    return currentState === PENCIL_STATE.ACTIVE ? PENCIL_STATE.INACTIVE : PENCIL_STATE.ACTIVE
}

const Pencil_ = ({ iconBoxSize }) => {

    // read the initial cache from global state
    const [pencilState, setPencilState] = useState(PENCIL_STATE.INACTIVE)

    // passing it as prop for let's use useCallback
    const onPress = useCallback(() => {
        // TODO: animate the icon and make some UI changes so that user knows if the pencil is active or not
        setPencilState(getNewPencilState(pencilState))
        emit(EVENTS.PENCIL_CLICKED)
    }, [pencilState])

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
