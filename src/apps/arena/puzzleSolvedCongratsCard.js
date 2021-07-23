import React from 'react'
import { View, Text, StyleSheet,  } from 'react-native'
import { Touchable, TouchableTypes } from '../components/Touchable'
import { noOperationFunction } from '../../utils/util'
import { TrophyIcon } from '../../resources/svgIcons/congratsTrophy'

const TROPHY_ICON_DIMENSION = 60
const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        width: '70%',
    },
    congratsText: {
        fontSize: 30, 
        fontWeight: 'bold',
        marginVertical: 8,
    },
    statsContainer: {
        marginTop: 20,
        width: '100%'
    },
    statContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 2,
    },
    statText: {
        fontSize: 16,
    },
    newGameButtonContainer: {
        width: '80%',
        paddingVertical: 8,
        alignItems: 'center',
        backgroundColor: '#4088da',
        borderRadius: 3,
        marginTop: 16,
    },
    newGameText: {
        fontSize: 20,
        color: 'white',
    }
})

// TODO: this is duplicated, put this in utils 
const getTimeComponentString = (value) => {
    if(value > 9) return `${value}`
    else return `0${value}`
}

const getTimeView = (timeTaken = {}) => {
    const { hours, minutes, seconds } = timeTaken
    if (!hours && !minutes && !seconds) return null
    return (
        <View style={{ flexDirection: 'row' }}>
            {hours ? <Text style={styles.statText}>{hours}</Text> : null}
            <Text style={styles.statText}>{`${getTimeComponentString(minutes)}:`}</Text>
            <Text style={styles.statText}>{getTimeComponentString(seconds)}</Text>
        </View>
    )
}

const CongratsCard_ = ({ stats, openNextGameMenu }) => {
    return (
        <Touchable 
            touchable={TouchableTypes.opacity}
            activeOpacity={1}
            onPress={noOperationFunction}
            style={styles.container}
        >
            <TrophyIcon width={TROPHY_ICON_DIMENSION} height={TROPHY_ICON_DIMENSION} />
            <Text style={styles.congratsText}>{'Congratulations!'}</Text>
            <View style={styles.statsContainer}>
                <View style={styles.statContainer}>
                    <Text style={styles.statText}>{'Difficulty'}</Text>
                    <Text style={styles.statText}>{stats.difficultyLevel}</Text>
                </View>
                <View style={styles.statContainer}>
                    <Text style={styles.statText}>{'Time'}</Text>
                    {getTimeView(stats.time)}
                </View>
                <View style={styles.statContainer}>
                    <Text style={styles.statText}>{'Mistakes'}</Text>
                    <Text style={styles.statText}>{stats.mistakes}</Text>
                </View>
                <View style={styles.statContainer}>
                    <Text style={styles.statText}>{'Hints Used'}</Text>
                    <Text style={styles.statText}>{stats.hintsUsed}</Text>
                </View>
            </View>
            <Touchable 
                touchable={TouchableTypes.opacity}
                onPress={openNextGameMenu}
                style={styles.newGameButtonContainer}
            >
                <Text style={styles.newGameText}>{'New Game'}</Text>
            </Touchable>
        </Touchable>
    )
}

export const CongratsCard = React.memo(CongratsCard_)
