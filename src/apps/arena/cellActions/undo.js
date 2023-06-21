import React from 'react'

import { Text } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { UndoIcon } from '@resources/svgIcons/undo'

import { Touchable } from '../../components/Touchable'

import { Styles, INACTIVE_ICON_FILL } from './style'

const Undo_ = ({ iconBoxSize, onClick }) => (
    <Touchable style={Styles.actionContainer} onPress={onClick}>
        <UndoIcon iconBoxSize={iconBoxSize} fill={INACTIVE_ICON_FILL} />
        <Text style={Styles.actionText}>Undo</Text>
    </Touchable>
)

export const Undo = React.memo(Undo_)

Undo_.propTypes = {
    iconBoxSize: PropTypes.number,
    onClick: PropTypes.func,
}

Undo_.defaultProps = {
    iconBoxSize: 40,
    onClick: _noop,
}
