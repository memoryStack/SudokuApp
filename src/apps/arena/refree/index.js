import React, { useCallback, useEffect } from 'react'

import { View, Text, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { GAME_STATE } from '../../../resources/constants'
import { fonts } from '../../../resources/fonts/font'
import withActions from '../../../utils/hocs/withActions'
import { useCacheGameState } from '../hooks/useCacheGameState'
import { startTimer, stopTimer } from '../store/actions/refree.actions'
import { getGameState } from '../store/selectors/gameState.selectors'
import { getMistakes, getDifficultyLevel, getTime, getMaxMistakesLimit } from '../store/selectors/refree.selectors'
import { Timer } from '../timer'
import { GAME_DATA_KEYS } from '../utils/cacheGameHandler'
import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'

const styles = StyleSheet.create({
    refereeContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '94%',
        marginBottom: 4,
    },
    refereeTextStyles: {
        fontSize: 14,
        fontFamily: fonts.regular,
    },
})

const _Refree = ({ onAction }) => {
    const maxMistakesLimit = useSelector(getMaxMistakesLimit)
    const mistakes = useSelector(getMistakes)
    const difficultyLevel = useSelector(getDifficultyLevel)
    const time = useSelector(getTime)

    const gameState = useSelector(getGameState)

    useEffect(() => {
        return () => {
            onAction({ type: ACTION_TYPES.ON_UNMOUNT })
        }
    }, [])

    useEffect(() => {
        if (mistakes >= maxMistakesLimit) {
            onAction({
                type: ACTION_TYPES.MAX_MISTAKES_LIMIT_REACHED
            })
        }
    }, [mistakes, maxMistakesLimit])

    // TODO: check what happens when back button is pressed
    useEffect(() => {
        if (gameState === GAME_STATE.ACTIVE) startTimer()
        else stopTimer()
        return () => stopTimer()
    }, [gameState])

    useCacheGameState(GAME_DATA_KEYS.REFEREE, { difficultyLevel, mistakes, time })

    const onTimerClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_TIMER_CLICK })
    }, [onAction])

    return (
        <View style={styles.refereeContainer}>
            <Text style={styles.refereeTextStyles}>{`Mistakes: ${mistakes} / ${maxMistakesLimit}`}</Text>
            <Text style={styles.refereeTextStyles}>{difficultyLevel}</Text>
            <Timer time={time} onClick={onTimerClick} />
        </View>
    )
}

export default React.memo(withActions(ACTION_HANDLERS)(_Refree))
