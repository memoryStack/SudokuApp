import React from 'react'
import { Text } from 'react-native'
import { Styles, INACTIVE_ICON_FILL } from './style'
import { PencilIcon } from '../../../resources/svgIcons/pencil'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { PENCIL_STATE } from '../../../resources/constants'

const ACTIVE_PENCIL_FILL = 'rgb(57, 91, 158)'

// TODO: use pencilState to animate the UI
const Pencil_ = ({ iconBoxSize, pencilState, onClick }) => {
    const isActive = pencilState === PENCIL_STATE.ACTIVE

    return (
        <Touchable style={Styles.actionContainer} onPress={onClick} touchable={TouchableTypes.opacity}>
            <PencilIcon iconBoxSize={iconBoxSize} fill={isActive ? ACTIVE_PENCIL_FILL : INACTIVE_ICON_FILL} />
            <Text
                style={[Styles.actionText, { color: isActive ? ACTIVE_PENCIL_FILL : INACTIVE_ICON_FILL }]}
            >{`Pencil`}</Text>
        </Touchable>
    )
}

export const Pencil = React.memo(Pencil_)
