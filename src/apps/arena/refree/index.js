import React, { useCallback } from 'react'

import { View, Text, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { fonts } from '../../../resources/fonts/font'
import withActions from '../../../utils/hocs/withActions'
import { getMistakes, getDifficultyLevel } from '../store/selectors/refree.selectors'
import { Timer } from '../timer'
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

const _Refree = ({
    maxMistakesLimit,
    onAction,
}) => {

    const mistakes = useSelector(getMistakes)
    const difficultyLevel = useSelector(getDifficultyLevel)

    const onTimerClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_TIMER_CLICK })
    }, [onAction])

    return (
        <View style={styles.refereeContainer}>
            <Text style={styles.refereeTextStyles}>{`Mistakes: ${mistakes} / ${maxMistakesLimit}`}</Text>
            <Text style={styles.refereeTextStyles}>{difficultyLevel}</Text>
            <Timer onClick={onTimerClick} />
        </View>
    )
}

export default React.memo(withActions(ACTION_HANDLERS)( _Refree))
