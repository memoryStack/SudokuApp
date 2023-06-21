import React from 'react'

import { Text } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { PENCIL_STATE } from '@resources/constants'
import { PencilIcon } from '@resources/svgIcons/pencil'

import { Touchable } from '../../components/Touchable'

import { Styles, INACTIVE_ICON_FILL } from './style'

const ACTIVE_PENCIL_FILL = 'rgb(57, 91, 158)'

// TODO: use pencilState to animate the UI
const Pencil_ = ({ iconBoxSize, pencilState, onClick }) => {
    const isActive = pencilState === PENCIL_STATE.ACTIVE

    return (
        <Touchable style={Styles.actionContainer} onPress={onClick}>
            <PencilIcon iconBoxSize={iconBoxSize} fill={isActive ? ACTIVE_PENCIL_FILL : INACTIVE_ICON_FILL} />
            <Text
                style={[Styles.actionText, { color: isActive ? ACTIVE_PENCIL_FILL : INACTIVE_ICON_FILL }]}
            >
                Pencil
            </Text>
        </Touchable>
    )
}

export const Pencil = React.memo(Pencil_)

Pencil_.propTypes = {
    iconBoxSize: PropTypes.number,
    onClick: PropTypes.func,
    pencilState: PropTypes.string,
}

Pencil_.defaultProps = {
    iconBoxSize: 40,
    onClick: _noop,
    pencilState: PENCIL_STATE.INACTIVE,
}
