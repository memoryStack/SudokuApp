import React from 'react'
import { View, Text, StyleSheet,  } from 'react-native'
import { Touchable, TouchableTypes } from '../components/Touchable'
import { noOperationFunction } from '../../utils/util'
import { TrophyIcon } from '../../resources/svgIcons/congratsTrophy'
import { GAME_STATE } from '../../resources/constants'
import { getTimeComponentString } from './utils/util'
import { NewGameButton } from './newGameButton'

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
    gameUnsolvedMsg: {
        textAlign: 'center',
    },
    newGameButtonContainer: {
        marginTop: 16,
        width: '80%',
    },
    timeStatContainer: {
        flexDirection: 'row',
    }
})

const getTimeView = (timeTaken = {}) => {
    const { hours = 0, minutes = 0, seconds = 0 } = timeTaken
    return (
        <View style={styles.timeStatContainer}>
            {hours ? <Text style={styles.statText}>{hours}</Text> : null}
            <Text style={styles.statText}>{`${getTimeComponentString(minutes)}:`}</Text>
            <Text style={styles.statText}>{getTimeComponentString(seconds)}</Text>
        </View>
    )
}

// TODO: change this file name to something generic
const GameOverCard_ = ({ gameState, stats, openNextGameMenu }) => {

    const {
        mistakes,
        difficultyLevel,
        time,
        hintsUsed,
    } = stats

    const gameSolved = gameState === GAME_STATE.OVER_SOLVED
    const gameUnsolved = gameState === GAME_STATE.OVER_UNSOLVED

    const getGameSolvedView = () => {
        return (
            <>
                {/* 
                    this trophy icon works well only for debug builds. for release build app crashes. my guess is that it's because of wrong formats.
                    like "m"(web) and "M"(App) for drawings
                */}
                {/* <TrophyIcon width={TROPHY_ICON_DIMENSION} height={TROPHY_ICON_DIMENSION} /> */}
                <Text style={styles.congratsText}>{'Congratulations!'}</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statContainer}>
                        <Text style={styles.statText}>{'Difficulty'}</Text>
                        <Text style={styles.statText}>{difficultyLevel}</Text>
                    </View>
                    <View style={styles.statContainer}>
                        <Text style={styles.statText}>{'Time'}</Text>
                        {getTimeView(time)}
                    </View>
                    <View style={styles.statContainer}>
                        <Text style={styles.statText}>{'Mistakes'}</Text>
                        <Text style={styles.statText}>{mistakes}</Text>
                    </View>
                    <View style={styles.statContainer}>
                        <Text style={styles.statText}>{'Hints Used'}</Text>
                        <Text style={styles.statText}>{hintsUsed}</Text>
                    </View>
                </View>
            </>
        )
    }

    const getGameUnsolvedView = () => (
        <Text style={styles.gameUnsolvedMsg}>
            {'you have reached the maximum mistakes limit\nGood Luck Next Time'}
        </Text>
    )

    return (
        <Touchable 
            touchable={TouchableTypes.opacity}
            activeOpacity={1}
            onPress={noOperationFunction}
            style={styles.container}
        >
            {gameSolved ? getGameSolvedView() : gameUnsolved ? getGameUnsolvedView() : null}
            <NewGameButton 
                onClick={openNextGameMenu}
                containerStyle={styles.newGameButtonContainer}
            />
        </Touchable>
    )
}

export const GameOverCard = React.memo(GameOverCard_)