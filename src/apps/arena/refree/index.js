import React, { useCallback, useEffect } from 'react'

import { View, StyleSheet } from 'react-native'

import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'
import get from '@lodash/get'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'

import { Timer as TimeManager } from '@utils/classes/timer'

import { useDependency } from '../../../hooks/useDependency'
import withActions from '../../../utils/hocs/withActions'

import { useCacheGameState } from '../hooks/useCacheGameState'
import { getGameState } from '../store/selectors/gameState.selectors'
import {
    getMistakes, getDifficultyLevel, getTime, getMaxMistakesLimit,
} from '../store/selectors/refree.selectors'
import { Timer } from '../timer'
import { GAME_DATA_KEYS } from '../utils/cacheGameHandler'
import { GameState } from '../utils/classes/gameState'

import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'
import { MISTAKES_TEXT_TEST_ID, PUZZLE_LEVEL_TEXT_TEST_ID } from './refree.constants'

const getStyles = (_, theme) => StyleSheet.create({
    refereeContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '94%',
        marginBottom: 8,
    },
    textColor: {
        color: get(theme, ['colors', 'on-surface-variant-low']),
    },
})

const Refree_ = ({ onAction }) => {
    const dependencies = useDependency()

    const styles = useStyles(getStyles)

    const maxMistakesLimit = useSelector(getMaxMistakesLimit)
    const mistakes = useSelector(getMistakes)
    const difficultyLevel = useSelector(getDifficultyLevel)
    const time = useSelector(getTime)

    const gameState = useSelector(getGameState)

    useEffect(() => () => {
        onAction({ type: ACTION_TYPES.ON_UNMOUNT, payload: { dependencies } })
    }, [onAction, dependencies])

    useEffect(() => {
        if (mistakes >= maxMistakesLimit) {
            onAction({ type: ACTION_TYPES.MAX_MISTAKES_LIMIT_REACHED, payload: { dependencies } })
        }
    }, [onAction, mistakes, maxMistakesLimit, dependencies])

    useEffect(() => {
        const stopTimer = () => onAction({ type: ACTION_TYPES.ON_STOP_TIMER })
        if (new GameState(gameState).isGameActive()) onAction({ type: ACTION_TYPES.ON_START_TIMER })
        else stopTimer()

        return () => stopTimer()
    }, [onAction, gameState])

    useCacheGameState(GAME_DATA_KEYS.REFEREE, { difficultyLevel, mistakes, time })

    const onTimerClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_TIMER_CLICK, payload: { dependencies } })
    }, [onAction, dependencies])

    return (
        <View style={styles.refereeContainer}>
            <Text style={styles.textColor} testID={MISTAKES_TEXT_TEST_ID} type={TEXT_VARIATIONS.BODY_MEDIUM}>
                {`Mistakes: ${mistakes}/${maxMistakesLimit}`}
            </Text>
            <Text
                style={styles.textColor}
                type={TEXT_VARIATIONS.BODY_MEDIUM}
                testID={PUZZLE_LEVEL_TEXT_TEST_ID}
            >
                {difficultyLevel}
            </Text>
            <Timer time={time} onClick={onTimerClick} />
        </View>
    )
}

export default React.memo(withActions({ actionHandlers: ACTION_HANDLERS })(Refree_))

Refree_.propTypes = {
    onAction: PropTypes.func,
    // eslint-disable-next-line react/no-unused-prop-types
    timer: PropTypes.instanceOf(TimeManager).isRequired,
}

Refree_.defaultProps = {
    onAction: _noop,
}
