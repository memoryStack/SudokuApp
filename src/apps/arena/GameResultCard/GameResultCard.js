import React from 'react'

import { View, StyleSheet } from 'react-native'

import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'
import _prependZero from '@lodash/prependZero'

import { NEW_GAME } from '@resources/stringLiterals'

import Button from '@ui/molecules/Button'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { GameState } from '../utils/classes/gameState'
import { getGameState } from '../store/selectors/gameState.selectors'

import { GAME_OVER_CARD_TEST_ID } from './gameResultCard.constants'

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        width: '70%',
    },
    congratsText: {
        marginVertical: 8,
        fontWeight: '500',
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
            {hours ? <Text>{hours}</Text> : null}
            <Text>{`${_prependZero(minutes)}:`}</Text>
            <Text>{_prependZero(seconds)}</Text>
        </View>
    )
}

const GameResultCard = ({ stats, openNextGameMenu }) => {
    const {
        mistakes, difficultyLevel, time, hintsUsed,
    } = stats

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
                <Text style={styles.congratsText} type={TEXT_VARIATIONS.HEADING_SMALL}>Congratulations!</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statContainer}>
                        <Text>Difficulty</Text>
                        <Text>{difficultyLevel}</Text>
                    </View>
                    <View style={styles.statContainer}>
                        <Text>Time</Text>
                        {getTimeView(time)}
                    </View>
                    <View style={styles.statContainer}>
                        <Text>Mistakes</Text>
                        <Text>{mistakes}</Text>
                    </View>
                    <View style={styles.statContainer}>
                        <Text>Hints Used</Text>
                        <Text>{hintsUsed}</Text>
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

    const renderNewGameButton = () => (
        <Button
            label={NEW_GAME}
            onClick={openNextGameMenu}
            containerStyle={styles.newGameButtonContainer}
        />
    )

    return (
        <View
            onStartShouldSetResponder={() => true}
            style={styles.container}
            testID={GAME_OVER_CARD_TEST_ID}
        >
            {getGameSolvedView()}
            {getGameUnsolvedView()}
            {renderNewGameButton()}
        </View>
    )
}

export default React.memo(GameResultCard)

GameResultCard.propTypes = {
    stats: PropTypes.object,
    openNextGameMenu: PropTypes.func,
}

GameResultCard.defaultProps = {
    stats: {},
    openNextGameMenu: _noop,
}
