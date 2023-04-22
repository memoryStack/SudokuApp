import React from 'react'

import { View, Text, StyleSheet } from 'react-native'

import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { GAME_STATE } from '../../../resources/constants'
import { noop } from '../../../utils/util'
import { fonts } from '../../../resources/fonts/font'

import { Touchable, TouchableTypes } from '../../components/Touchable'

import { getGameState } from '../store/selectors/gameState.selectors'
import { addLeadingZeroIfEligible } from '../utils/util'
import { GameState } from '../utils/classes/gameState'

const hitSlop = {
    left: 8, right: 8, bottom: 8, top: 8,
}
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

const Timer_ = ({ onClick = noop, time }) => {
    const gameState = useSelector(getGameState)

    const getStartTimerIcon = () => <View style={styles.triangleShape} />

    const getPauseTimerIcon = () => (
        <View style={styles.pauseTimerIconContainer}>
            <View style={[styles.pauseButtonMiddleGap, styles.rectangleShape]} />
            <View style={styles.rectangleShape} />
        </View>
    )

    const renderTimerStateIcon = () => (new GameState(gameState).isGameActive() ? getPauseTimerIcon() : getStartTimerIcon())

    return (
        <Touchable style={styles.timeCounter} onPress={onClick} touchable={TouchableTypes.opacity} hitSlop={hitSlop}>
            <Text style={styles.textStyles}>{`${addLeadingZeroIfEligible(time.hours)}:`}</Text>
            <Text style={styles.textStyles}>{`${addLeadingZeroIfEligible(time.minutes)}:`}</Text>
            <Text style={styles.textStyles}>{`${addLeadingZeroIfEligible(time.seconds)}`}</Text>
            {renderTimerStateIcon()}
        </Touchable>
    )
}

export const Timer = React.memo(Timer_)

Timer_.propTypes = {
    time: PropTypes.number,
    onClick: PropTypes.func,
}

Timer_.defaultProps = {
    time: { hours: 0, minutes: 0, seconds: 0 },
    onClick: _noop,
}
