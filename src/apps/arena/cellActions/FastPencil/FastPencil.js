import React from 'react'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { PencilIcon } from '@resources/svgIcons/pencil'

import Text from '@ui/atoms/Text'

import { Touchable } from '../../../components/Touchable'

import { styles, INACTIVE_ICON_FILL } from '../style'

const FastPencil = ({ iconBoxSize, onClick, ...rest }) => (
    <Touchable style={styles.actionContainer} onPress={onClick} {...rest}>
        <PencilIcon iconBoxSize={iconBoxSize} fill={INACTIVE_ICON_FILL} />
        <Text style={styles.actionText}>Fast Pencil</Text>
    </Touchable>
)

export default React.memo(FastPencil)

FastPencil.propTypes = {
    iconBoxSize: PropTypes.number,
    onClick: PropTypes.func,
}

FastPencil.defaultProps = {
    iconBoxSize: 40,
    onClick: _noop,
}
