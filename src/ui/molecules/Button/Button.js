import React from 'react'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { useStyles } from '@utils/customHooks/useStyles'

import Text from '@ui/atoms/Text'
import { Touchable } from '../../../apps/components/Touchable'

import { getStyles } from './button.styles'
import { BUTTON_STATES, BUTTON_TYPES } from './button.constants'

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
            style={[avoidDefaultContainerStyles ? null : styles.defaultContainer, containerStyle]}
            avoidDefaultStyles={avoidDefaultContainerStyles}
            onPress={onClick}
            disabled={state === BUTTON_STATES.DISABLED}
            addHitSlop={type === BUTTON_TYPES.TEXT}
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
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
