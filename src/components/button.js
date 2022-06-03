import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { Touchable, TouchableTypes } from '../apps/components/Touchable'
import { noop } from '../utils/util'
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
    onClick = noop,
    containerStyle = null,
    text = '',
    textStyles = null,
    avoidDefaultContainerStyles = false,
    ...rest
}) => {
    return (
        <Touchable
            touchable={TouchableTypes.opacity}
            onPress={onClick}
            style={[avoidDefaultContainerStyles ? null : styles.defaultContainer, containerStyle]}
            {...rest}
        >
            <Text style={[styles.defaultText, textStyles]}>{text}</Text>
        </Touchable>
    )
}

export const Button = React.memo(Button_)
