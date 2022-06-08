import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { fonts } from '../../resources/fonts/font'

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        padding: 16,
        marginHorizontal: 24,
        backgroundColor: 'black', // replace this after talking to designer
        position: 'absolute',
        bottom: 100,
        alignSelf: 'center',
    },
    msgTextStyle: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white', // need designer's input
        fontFamily: fonts.regular,
    },
})

const SnackBar_ = ({ msg = '', customStyles = null }) => {
    console.log('@@@@@@', customStyles)
    return (
        <View style={[styles.container, customStyles]}>
            <Text style={styles.msgTextStyle}>{msg}</Text>
        </View>
    )
}

export const SnackBar = React.memo(SnackBar_)
