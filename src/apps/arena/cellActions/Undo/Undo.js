import React from 'react'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { UndoIcon } from '@resources/svgIcons/undo'

import Text from '@ui/atoms/Text'

import { Touchable } from '../../../components/Touchable'

import { styles, INACTIVE_ICON_FILL } from '../style'

const Undo = ({ iconBoxSize, onClick, ...rest }) => (
    <Touchable style={styles.actionContainer} onPress={onClick} {...rest}>
        <UndoIcon iconBoxSize={iconBoxSize} fill={INACTIVE_ICON_FILL} />
        <Text style={styles.actionText}>Undo</Text>
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
