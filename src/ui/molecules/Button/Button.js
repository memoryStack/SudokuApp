import React from 'react'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { useStyles } from '@utils/customHooks/useStyles'

import { Touchable, TouchableTypes } from 'src/apps/components/Touchable'

import Text from '@ui/atoms/Text'

import { getStyles } from './button.styles'
import { BUTTON_STATES, BUTTON_TYPES, HIT_SLOP } from './button.constants'

const Button_ = ({
    onClick,
    containerStyle = null,
    label = '',
    textStyles = null,
    avoidDefaultContainerStyles = false,
    type,
    state,
    ...rest
}) => {
    const styles = useStyles(getStyles, {
        type,
        state,
        isLabelAvailable: !!label,
        isIconAvailable: false,
    })

    return (
        <Touchable
            touchable={TouchableTypes.opacity}
            style={[avoidDefaultContainerStyles ? null : styles.defaultContainer, containerStyle]}
            avoidDefaultStyles={avoidDefaultContainerStyles}
            onPress={onClick}
            disabled={state === BUTTON_STATES.DISABLED}
            hitSlop={type === BUTTON_TYPES.TEXT ? HIT_SLOP : null}
            accessibilityRole="button"
            {...rest}
        >
            <Text style={{ ...styles.defaultText, ...textStyles }}>
                {label}
            </Text>
        </Touchable>
    )
}

export default React.memo(Button_)

Button_.propTypes = {
    onClick: PropTypes.func,
    containerStyle: PropTypes.object,
    label: PropTypes.string,
    textStyles: PropTypes.object,
    avoidDefaultContainerStyles: PropTypes.bool,
    type: PropTypes.oneOf(Object.values(BUTTON_TYPES)),
    state: PropTypes.oneOf(Object.values(BUTTON_STATES)),
}

Button_.defaultProps = {
    onClick: _noop,
    containerStyle: null,
    label: '',
    textStyles: null,
    avoidDefaultContainerStyles: false,
    type: BUTTON_TYPES.FILLED,
    state: BUTTON_STATES.ENABLED,
}
