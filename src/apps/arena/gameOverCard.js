import React from 'react'

import { View, Text, StyleSheet } from 'react-native'

import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import _noop from 'lodash/src/utils/noop'

import { TrophyIcon } from '../../resources/svgIcons/congratsTrophy'
import { Button } from '../../components/button'
import { NEW_GAME } from '../../resources/stringLiterals'
import { fonts } from '../../resources/fonts/font'
import { Touchable, TouchableTypes } from '../components/Touchable'

import { getTimeComponentString } from './utils/util'
import { GameState } from './utils/classes/gameState'
import { getGameState } from './store/selectors/gameState.selectors'

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
        fontFamily: fonts.regular,
    },
    statsContainer: {
        marginTop: 20,
        width: '100%',
    },
    statContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 2,
    },
    statText: {
        fontSize: 16,
        fontFamily: fonts.regular,
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
    },
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
const GameOverCard_ = ({ stats, openNextGameMenu }) => {
    const { mistakes, difficultyLevel, time, hintsUsed } = stats

    const gameState = useSelector(getGameState)

    const getGameSolvedView = () => {
        if (!new GameState(gameState).isGameSolved()) return null

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

    const getGameUnsolvedView = () => {
        if (!new GameState(gameState).isGameUnsolved()) return null
        return (
            <Text style={styles.gameUnsolvedMsg}>
                {'you have reached the maximum mistakes limit\nGood Luck Next Time'}
            </Text>
        )
    }

    const renderNewGameButton = () => {
        return <Button text={NEW_GAME} onClick={openNextGameMenu} containerStyle={styles.newGameButtonContainer} />
    }

    return (
        <Touchable
            touchable={TouchableTypes.opacity}
            activeOpacity={1}
            onPress={_noop}
            style={styles.container}>
            {getGameSolvedView()}
            {getGameUnsolvedView()}
            {renderNewGameButton()}
        </Touchable>
    )
}

export const GameOverCard = React.memo(GameOverCard_)

GameOverCard_.propTypes = {
    stats: PropTypes.object,
    openNextGameMenu: PropTypes.func,
}

GameOverCard_.defaultProps = {
    stats: {},
    openNextGameMenu: _noop,
}
