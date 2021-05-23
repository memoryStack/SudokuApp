import React, { useCallback } from 'react'
import { Text } from 'react-native'
import { Styles } from './style'
import { EraserIcon } from '../../../../resources/svgIcons/eraser'
import { Touchable, TouchableTypes } from '../../../components/Touchable'
import { emit } from '../../../../utils/GlobalEventBus'
import { EVENTS } from '../../../../resources/constants'

const Eraser_ = ({ iconBoxSize }) => {

    // passing it as prop for let's use useCallback
    const onPress = useCallback(() => {
        // TODO: perform some kind of animation for the icon
        emit(EVENTS.ERASER_CLICKED)
    }, [])

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

