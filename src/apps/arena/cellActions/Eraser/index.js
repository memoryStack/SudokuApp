import React from 'react'
import { Image } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { PencilIcon } from '@resources/svgIcons/pencil'

import Text from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'

import { Touchable } from '../../../components/Touchable'

import { getStyles } from '../cellActions.styles'

const ERASER_SOURCE = require('@resources/assets/eraser.png')

const Eraser = ({
    iconBoxSize, isActive, onClick, disabled, textStyles, ...rest
}) => {
    const styles = useStyles(getStyles)
    return (
        <Touchable style={styles.actionContainer} onPress={onClick} disabled={disabled} {...rest}>
            <Image style={[styles.eraser, { width: iconBoxSize, height: iconBoxSize }, disabled ? { opacity: 0.5 } : null]} source={ERASER_SOURCE} />
            <Text style={[styles.actionText, isActive ? styles.activeState : styles.inactiveState, textStyles]}>
                Eraser
            </Text>
        </Touchable>
    )
}
export default React.memo(Eraser)

Eraser.propTypes = {
    iconBoxSize: PropTypes.number,
    onClick: PropTypes.func,
    isActive: PropTypes.bool,
}

Eraser.defaultProps = {
    iconBoxSize: 40,
    onClick: _noop,
    isActive: false,
}
