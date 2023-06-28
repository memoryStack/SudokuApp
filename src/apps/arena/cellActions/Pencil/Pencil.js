import React from 'react'

import { Text } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { PencilIcon } from '@resources/svgIcons/pencil'

import { Touchable } from '../../../components/Touchable'

import { Styles, INACTIVE_ICON_FILL } from '../style'

const ACTIVE_PENCIL_FILL = 'rgb(57, 91, 158)'

const Pencil = ({
    iconBoxSize, isActive, onClick, ...rest
}) => (
    <Touchable style={Styles.actionContainer} onPress={onClick} {...rest}>
        <PencilIcon iconBoxSize={iconBoxSize} fill={isActive ? ACTIVE_PENCIL_FILL : INACTIVE_ICON_FILL} />
        <Text
            style={[Styles.actionText, { color: isActive ? ACTIVE_PENCIL_FILL : INACTIVE_ICON_FILL }]}
        >
            Pencil
        </Text>
    </Touchable>
)

export default React.memo(Pencil)

Pencil.propTypes = {
    iconBoxSize: PropTypes.number,
    onClick: PropTypes.func,
    isActive: PropTypes.bool,
}

Pencil.defaultProps = {
    iconBoxSize: 40,
    onClick: _noop,
    isActive: false,
}
