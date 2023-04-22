import React from 'react'

import { Text } from 'react-native'

import PropTypes from 'prop-types'

import _noop from 'lodash/src/utils/noop'

import { useStyles } from '@utils/customHooks/useStyles'

import { Touchable, TouchableTypes } from 'src/apps/components/Touchable'

import { getStyles } from './button.styles'
import { BUTTON_STATES, BUTTON_TYPES } from './button.constants'

/*
    issues
        1. height is fixed for buttons. what if i want buttons to have bigger lebel-texts
            MD doesn't talk about this requirement
        2. font-weight is very less for buttons
        3. there is not support for text-formats like AllCaps or itallics
*/

// TODO: make the touchable configurable as well when in need
// TODO: add support for touchable hitslops as well
const Button_ = ({
    onClick,
    containerStyle = null,
    text = '',
    textStyles = null,
    avoidDefaultContainerStyles = false,
    type,
    state,
    ...rest
}) => {
    const styles = useStyles(getStyles, {
        type, state, isTextAvailable: !!text, isIconAvailable: false,
    })

    // TODO: is state is disabled then which touchable component should be used ??
    return (
        <Touchable
            touchable={TouchableTypes.opacity}
            style={[avoidDefaultContainerStyles ? null : styles.defaultContainer, containerStyle]}
            onPress={onClick}
            {...rest}
            disabled={state === BUTTON_STATES.DISABLED}
        >
            <Text style={[styles.defaultText, textStyles]}>{text}</Text>
        </Touchable>
    )
}

export default React.memo(Button_)

Button_.propTypes = {
    onClick: PropTypes.func,
    containerStyle: PropTypes.object,
    text: PropTypes.string,
    textStyles: PropTypes.object,
    avoidDefaultContainerStyles: PropTypes.bool,
    type: PropTypes.oneOf(Object.values(BUTTON_TYPES)),
    state: PropTypes.oneOf(Object.values(BUTTON_STATES)),
}

Button_.defaultProps = {
    onClick: _noop,
    containerStyle: null,
    text: '',
    textStyles: null,
    avoidDefaultContainerStyles: false,
    // type: BUTTON_TYPES.FILLED,
    type: BUTTON_TYPES.TONAL,
    state: BUTTON_STATES.ENABLED,
}
