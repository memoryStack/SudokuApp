import React from 'react'

import { View } from 'react-native'

import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'
import _prependZero from '@lodash/prependZero'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'
import { useStyles } from '@utils/customHooks/useStyles'
import { Touchable } from '../../components/Touchable'

import { getGameState } from '../store/selectors/gameState.selectors'

import { GameState } from '@application/utils/gameState'

import { TIMER_TEST_ID, TIMER_PAUSE_ICON_TEST_ID, TIMER_START_ICON_TEST_ID } from './timer.constants'

import { getStyles } from './timer.styles'

const Timer_ = ({ onClick, time }) => {
    const gameState = useSelector(getGameState)

    const styles = useStyles(getStyles)

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
            <Text style={styles.timerText} type={TEXT_VARIATIONS.BODY_MEDIUM}>{`${_prependZero(time.hours)}:`}</Text>
            <Text style={styles.timerText} type={TEXT_VARIATIONS.BODY_MEDIUM}>{`${_prependZero(time.minutes)}:`}</Text>
            <Text style={styles.timerText} type={TEXT_VARIATIONS.BODY_MEDIUM}>{`${_prependZero(time.seconds)}`}</Text>
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
