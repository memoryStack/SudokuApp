import React from 'react'
import { Text } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { PencilIcon } from '@resources/svgIcons/pencil'
import { Touchable } from '../../components/Touchable'

import { Styles, INACTIVE_ICON_FILL } from './style'

// TODO: use pencilState to animate the UI
const FastPencil_ = ({ iconBoxSize, onClick, ...rest }) => (
    <Touchable style={Styles.actionContainer} onPress={onClick} {...rest}>
        <PencilIcon iconBoxSize={iconBoxSize} fill={INACTIVE_ICON_FILL} />
        <Text style={Styles.actionText}>Fast Pencil</Text>
    </Touchable>
)

export const FastPencil = React.memo(FastPencil_)

FastPencil_.propTypes = {
    iconBoxSize: PropTypes.number,
    onClick: PropTypes.func,
}

FastPencil_.defaultProps = {
    iconBoxSize: 40,
    onClick: _noop,
}
