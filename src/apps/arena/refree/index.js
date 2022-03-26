import React from 'react'

import { View, Text, StyleSheet } from 'react-native'
import { fonts } from '../../../resources/fonts/font'
import withActions from '../../../utils/hocs/withActions'
import { Timer } from '../timer'

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
    mistakes,
    onTimerClick,
    maxMistakesLimit,
    time,
    difficultyLevel,
    gameState,
}) => {
    return (
        <View style={styles.refereeContainer}>
            <Text style={styles.refereeTextStyles}>{`Mistakes: ${mistakes} / ${maxMistakesLimit}`}</Text>
            <Text style={styles.refereeTextStyles}>{difficultyLevel}</Text>
            <Timer gameState={gameState} time={time} onClick={onTimerClick} />
        </View>
    )
}

export default React.memo(_Refree)
