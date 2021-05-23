import React, { useCallback, useEffect } from 'react'
import { Text } from 'react-native'
import { Styles } from './style'
import { UndoIcon } from '../../../../resources/svgIcons/undo'
import { Touchable, TouchableTypes } from '../../../components/Touchable'
import { emit, addListener, removeListener } from '../../../../utils/GlobalEventBus'
import { EVENTS } from '../../../../resources/constants'

const Undo_ = ({ iconBoxSize }) => {

    // passing it as prop for let's use useCallback
    const onPress =  useCallback(() => {
        // TODO: animate the icon
        emit(EVENTS.UNDO_CLICKED)
    }, [])

    useEffect(() => {
        const handler = () => {
            // animate the to show the user that undo happened
        }
        addListener(EVENTS.UNDO_USED_SUCCESSFULLY, handler)
        return () => {
            removeListener(EVENTS.UNDO_USED_SUCCESSFULLY, handler)
        }
    }, [])

    return (
        <Touchable
            style={Styles.container}
            onPress={onPress}
            touchable={TouchableTypes.opacity}
        >
            <UndoIcon iconBoxSize={iconBoxSize} />
            <Text style={Styles.textStyle}>{`Undo`}</Text>
        </Touchable>
    )
}

export const Undo = React.memo(Undo_)
