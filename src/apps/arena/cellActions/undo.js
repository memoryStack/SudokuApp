import React from 'react'
import { Text } from 'react-native'
import { Styles, INACTIVE_ICON_FILL } from './style'
import { UndoIcon } from '../../../resources/svgIcons/undo'
import { Touchable, TouchableTypes } from '../../components/Touchable'

const Undo_ = ({ iconBoxSize, onClick }) => {
    return (
        <Touchable style={Styles.actionContainer} onPress={onClick} touchable={TouchableTypes.opacity}>
            <UndoIcon iconBoxSize={iconBoxSize} fill={INACTIVE_ICON_FILL} />
            <Text style={Styles.actionText}>{`Undo`}</Text>
        </Touchable>
    )
}

export const Undo = React.memo(Undo_)
