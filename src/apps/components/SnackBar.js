import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

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
    },
})

const SnackBar_ = ({ msg }) => {
    return (
        msg ? 
            <View style={styles.container}>
                <Text style={styles.msgTextStyle}>{msg}</Text>
            </View>
        : null
    )
}

export const SnackBar = React.memo(SnackBar_)