import React from 'react'
import { Text, StyleSheet,  } from 'react-native'
import { Touchable, TouchableTypes } from '../components/Touchable'
import { noOperationFunction } from '../../utils/util'

const styles = StyleSheet.create({
    newGameButtonContainer: {
        paddingVertical: 8,
        alignItems: 'center',
        backgroundColor: '#4088da',
        borderRadius: 3,
    },
    newGameText: {
        fontSize: 20,
        color: 'white',
    }
})

const NewGameButton_ = ({ onClick = noOperationFunction, containerStyle = null }) => {
    return (
        <Touchable 
                touchable={TouchableTypes.opacity}
                onPress={onClick}
                style={[styles.newGameButtonContainer, containerStyle]}
            >
                <Text style={styles.newGameText}>{'New Game'}</Text>
            </Touchable>
    )
}

export const NewGameButton = React.memo(NewGameButton_)
