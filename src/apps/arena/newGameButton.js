import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { Touchable, TouchableTypes } from '../components/Touchable'
import { noOperationFunction } from '../../utils/util'

const styles = StyleSheet.create({
    defaultContainer: {
        paddingVertical: 8,
        alignItems: 'center',
        backgroundColor: '#4088da',
        borderRadius: 3,
    },
    defaultText: {
        fontSize: 20,
        color: 'white',
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
