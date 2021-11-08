import React from 'react'
import { Text } from 'react-native'
import { Styles, INACTIVE_ICON_FILL } from './style'
import { PencilIcon } from '../../../resources/svgIcons/pencil'
import { Touchable, TouchableTypes } from '../../components/Touchable'

// TODO: use pencilState to animate the UI
const FastPencil_ = ({ iconBoxSize, onClick }) => {
    return (
        <Touchable style={Styles.actionContainer} onPress={onClick} touchable={TouchableTypes.opacity}>
            <PencilIcon iconBoxSize={iconBoxSize} fill={INACTIVE_ICON_FILL} />
            <Text style={Styles.actionText}>{`Fast Pencil`}</Text>
        </Touchable>
    )
}

export const FastPencil = React.memo(FastPencil_)
