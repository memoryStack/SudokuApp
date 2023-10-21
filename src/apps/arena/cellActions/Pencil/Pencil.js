import React from 'react'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { PencilIcon } from '@resources/svgIcons/pencil'

import Text from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'

import { Touchable } from '../../../components/Touchable'

import { getStyles } from '../cellActions.styles'

const Pencil = ({
    iconBoxSize, isActive, onClick, ...rest
}) => {
    const styles = useStyles(getStyles)
    return (
        <Touchable style={styles.actionContainer} onPress={onClick} {...rest}>
            <PencilIcon iconBoxSize={iconBoxSize} fill={isActive ? styles.activeState.color : styles.inactiveState.color} />
            <Text style={[styles.actionText, isActive ? styles.activeState : styles.inactiveState]}>
                Pencil
            </Text>
        </Touchable>
    )
}
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
