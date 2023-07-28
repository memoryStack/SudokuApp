import React from 'react'

import { View, StyleSheet } from 'react-native'

import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'
import { Touchable } from '../../components/Touchable'

import { getGameState } from '../store/selectors/gameState.selectors'
import { addLeadingZeroIfEligible } from '../utils/util'
import { GameState } from '../utils/classes/gameState'

import { TIMER_TEST_ID, TIMER_PAUSE_ICON_TEST_ID, TIMER_START_ICON_TEST_ID } from './timer.constants'

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

const Timer_ = ({ onClick, time }) => {
    const gameState = useSelector(getGameState)

    const getStartTimerIcon = () => <View style={styles.triangleShape} testID={TIMER_START_ICON_TEST_ID} />

    const getPauseTimerIcon = () => (
        <View
            style={styles.pauseTimerIconContainer}
            testID={TIMER_PAUSE_ICON_TEST_ID}
        >
            <View style={[styles.pauseButtonMiddleGap, styles.rectangleShape]} />
            <View style={styles.rectangleShape} />
        </View>
    )

    const renderTimerStateIcon = () => (new GameState(gameState).isGameActive() ? getPauseTimerIcon() : getStartTimerIcon())

    return (
        <Touchable
            style={styles.timeCounter}
            onPress={onClick}
            addHitSlop
            testID={TIMER_TEST_ID}
        >
            <Text type={TEXT_VARIATIONS.BODY_MEDIUM}>{`${addLeadingZeroIfEligible(time.hours)}:`}</Text>
            <Text type={TEXT_VARIATIONS.BODY_MEDIUM}>{`${addLeadingZeroIfEligible(time.minutes)}:`}</Text>
            <Text type={TEXT_VARIATIONS.BODY_MEDIUM}>{`${addLeadingZeroIfEligible(time.seconds)}`}</Text>
            {renderTimerStateIcon()}
        </Touchable>
    )
}

export const Timer = React.memo(Timer_)

Timer_.propTypes = {
    time: PropTypes.object,
    onClick: PropTypes.func,
}

Timer_.defaultProps = {
    time: { hours: 0, minutes: 0, seconds: 0 },
    onClick: _noop,
}
