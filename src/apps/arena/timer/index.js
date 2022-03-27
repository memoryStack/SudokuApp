import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { GAME_STATE } from '../../../resources/constants'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { getTimeComponentString } from '../utils/util'
import { noOperationFunction } from '../../../utils/util'
import { fonts } from '../../../resources/fonts/font'
import { useSelector } from 'react-redux'
import { getGameState } from '../store/selectors/gameState.selectors'
import { getTime } from '../store/selectors/refree.selectors'

const hitSlop = { left: 8, right: 8, bottom: 8, top: 8 }
const styles = StyleSheet.create({
    triangleShape: {
        width: 0,
        height: 0,
        borderWidth: 5,
        marginLeft: 2,
        borderRightWidth: 0,
        borderLeftWidth: 8,
        borderLeftColor: 'rgba(0, 0, 0, .5)',
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
    },
    pauseButtonMiddleGap: {
        marginRight: 2,
    },
    rectangleShape: {
        display: 'flex',
        width: 3,
        height: 10,
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
    textStyles: {
        fontSize: 14,
        fontFamily: fonts.regular,
    },
    timeCounter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '20%',
    },
    pauseTimerIconContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 2,
    },
})

const getStartTimerIcon = () => <View style={styles.triangleShape} />

const Timer_ = ({ onClick = noOperationFunction }) => {
    
    const gameState = useSelector(getGameState)
    const time = useSelector(getTime)

    const getPauseTimerIcon = () => {
        return (
            <View style={styles.pauseTimerIconContainer}>
                <View style={[styles.pauseButtonMiddleGap, styles.rectangleShape]} />
                <View style={styles.rectangleShape} />
            </View>
        )
    }

    return  (
        <Touchable style={styles.timeCounter} onPress={onClick} touchable={TouchableTypes.opacity} hitSlop={hitSlop}>
            <Text style={styles.textStyles}>{`${getTimeComponentString(time.hours)}:`}</Text>
            <Text style={styles.textStyles}>{`${getTimeComponentString(time.minutes)}:`}</Text>
            <Text style={styles.textStyles}>{`${getTimeComponentString(time.seconds)}`}</Text>
            {gameState === GAME_STATE.ACTIVE ? getPauseTimerIcon() : getStartTimerIcon()}
        </Touchable>
    )
}

export const Timer = React.memo(Timer_)
