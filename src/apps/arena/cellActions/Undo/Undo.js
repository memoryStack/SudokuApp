import React from 'react'

import { Text } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { UndoIcon } from '@resources/svgIcons/undo'

import { Touchable } from '../../../components/Touchable'

import { Styles, INACTIVE_ICON_FILL } from '../style'

const Undo = ({ iconBoxSize, onClick, ...rest }) => (
    <Touchable style={Styles.actionContainer} onPress={onClick} {...rest}>
        <UndoIcon iconBoxSize={iconBoxSize} fill={INACTIVE_ICON_FILL} />
        <Text style={Styles.actionText}>Undo</Text>
    </Touchable>
)

export default React.memo(Undo)

Undo.propTypes = {
    iconBoxSize: PropTypes.number,
    onClick: PropTypes.func,
}

Undo.defaultProps = {
    iconBoxSize: 40,
    onClick: _noop,
}
