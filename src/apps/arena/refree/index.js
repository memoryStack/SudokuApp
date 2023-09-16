import React, { useCallback, useEffect } from 'react'

import { View, StyleSheet } from 'react-native'

import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import withActions from '../../../utils/hocs/withActions'

import { useCacheGameState } from '../hooks/useCacheGameState'
import { startTimer, stopTimer } from '../store/actions/refree.actions'
import { getGameState } from '../store/selectors/gameState.selectors'
import {
    getMistakes, getDifficultyLevel, getTime, getMaxMistakesLimit,
} from '../store/selectors/refree.selectors'
import { Timer } from '../timer'
import { GAME_DATA_KEYS } from '../utils/cacheGameHandler'
import { GameState } from '../utils/classes/gameState'

import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'
import { MISTAKES_TEXT_TEST_ID } from './refree.constants'

const styles = StyleSheet.create({
    refereeContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '94%',
        marginBottom: 4,
    },
})

const Refree_ = ({ onAction }) => {
    const maxMistakesLimit = useSelector(getMaxMistakesLimit)
    const mistakes = useSelector(getMistakes)
    const difficultyLevel = useSelector(getDifficultyLevel)
    const time = useSelector(getTime)

    const gameState = useSelector(getGameState)

    useEffect(() => () => {
        onAction({ type: ACTION_TYPES.ON_UNMOUNT })
    }, [onAction])

    useEffect(() => {
        if (mistakes >= maxMistakesLimit) {
            onAction({
                type: ACTION_TYPES.MAX_MISTAKES_LIMIT_REACHED,
            })
        }
    }, [onAction, mistakes, maxMistakesLimit])

    useEffect(() => {
        if (new GameState(gameState).isGameActive()) startTimer()
        else stopTimer()
        return () => stopTimer()
    }, [gameState])

    useCacheGameState(GAME_DATA_KEYS.REFEREE, { difficultyLevel, mistakes, time })

    const onTimerClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_TIMER_CLICK, payload: gameState })
    }, [onAction, gameState])

    return (
        <View style={styles.refereeContainer}>
            <Text testID={MISTAKES_TEXT_TEST_ID} type={TEXT_VARIATIONS.BODY_MEDIUM}>
                {`Mistakes: ${mistakes} / ${maxMistakesLimit}`}
            </Text>
            <Text type={TEXT_VARIATIONS.BODY_MEDIUM}>{difficultyLevel}</Text>
            <Timer time={time} onClick={onTimerClick} />
        </View>
    )
}

export default React.memo(withActions({ actionHandlers: ACTION_HANDLERS })(Refree_))

Refree_.propTypes = {
    onAction: PropTypes.func,
}

Refree_.defaultProps = {
    onAction: _noop,
}
