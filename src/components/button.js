import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { Touchable, TouchableTypes } from '../apps/components/Touchable'
import { noOperationFunction } from '../utils/util'
import { fonts } from '../resources/fonts/font';

const styles = StyleSheet.create({
    defaultContainer: {
        paddingVertical: 8,
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
const Button_ = ({ onClick = noOperationFunction, containerStyle = null, text = '', textStyles = null }) => {
    return (
        <Touchable
            touchable={TouchableTypes.opacity}
            onPress={onClick}
            style={[styles.defaultContainer, containerStyle]}
        >
            <Text style={[styles.defaultText, textStyles]}>{text}</Text>
        </Touchable>
    )
}

export const Button = React.memo(Button_)
