import React, { useState, useEffect, useCallback, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { EVENTS, GAME_STATE } from '../../../resources/constants'
import { emit, addListener, removeListener } from '../../../utils/GlobalEventBus'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { usePrevious } from '../../../utils/customHooks'
import { isGameOver, getTimeComponentString } from '../utils/util'
import { noOperationFunction } from '../../../utils/util'

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
    },
    timeCounter: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    pauseTimerIconContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 2,
    },
})

const getPauseTimerIcon = () => {
    return (
        <View style={styles.pauseTimerIconContainer}>
            <View style={[styles.pauseButtonMiddleGap, styles.rectangleShape]} />
            <View style={styles.rectangleShape} />
        </View>
    )
}

const getStartTimerIcon = () => <View style={styles.triangleShape} />

const Timer_ = ({ gameState, time, onClick = noOperationFunction }) => (
    <Touchable
        style={styles.timeCounter}
        onPress={onClick}
        touchable={TouchableTypes.opacity}
        hitSlop={hitSlop}
    >
        <Text style={styles.textStyles}>{`${getTimeComponentString(time.hours)}:`}</Text>
        <Text style={styles.textStyles}>{`${getTimeComponentString(time.minutes)}:`}</Text>
        <Text style={styles.textStyles}>{`${getTimeComponentString(time.seconds)}`}</Text>
        {gameState === GAME_STATE.ACTIVE ? getPauseTimerIcon() : getStartTimerIcon()}
    </Touchable>
)

export const Timer = React.memo(Timer_)