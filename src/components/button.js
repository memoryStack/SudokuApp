import React from 'react'

import { Text, StyleSheet } from 'react-native'

import PropTypes from 'prop-types'

import _noop from 'lodash/src/utils/noop'

import { Touchable, TouchableTypes } from '../apps/components/Touchable'
import { fonts } from '../resources/fonts/font'

const styles = StyleSheet.create({
    defaultContainer: {
        paddingVertical: 8,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4088da',
        borderRadius: 3,
    },
    defaultText: {
        fontSize: 20,
        color: 'white',
        fontFamily: fonts.regular,
    },
})

// TODO: make the tuchable configurable as well when in need
// TODO: add support for touchable hitslops as well
const Button_ = ({
    onClick,
    containerStyle = null,
    text = '',
    textStyles = null,
    avoidDefaultContainerStyles = false,
    ...rest
}) => (
    <Touchable
        touchable={TouchableTypes.opacity}
        onPress={onClick}
        style={[avoidDefaultContainerStyles ? null : styles.defaultContainer, containerStyle]}
        {...rest}
    >
        <Text style={[styles.defaultText, textStyles]}>{text}</Text>
    </Touchable>
)

export const Button = React.memo(Button_)

Button_.propTypes = {
    onClick: PropTypes.func,
    containerStyle: PropTypes.object,
    text: PropTypes.string,
    textStyles: PropTypes.object,
    avoidDefaultContainerStyles: PropTypes.bool,
}

Button_.defaultProps = {
    onClick: _noop,
    containerStyle: null,
    text: '',
    textStyles: null,
    avoidDefaultContainerStyles: false,
}
