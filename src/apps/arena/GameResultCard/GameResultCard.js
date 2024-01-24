import React from 'react'

import { View } from 'react-native'

import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'
import _prependZero from '@lodash/prependZero'

import { NEW_GAME } from '@resources/stringLiterals'

import Button from '@ui/molecules/Button'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'
import { GameState } from '../utils/classes/gameState'
import { getGameState } from '../store/selectors/gameState.selectors'

import { GAME_OVER_CARD_TEST_ID } from './gameResultCard.constants'
import { getStyles } from './gameResultCard.styles'

const getTimeView = (time, styles) => {
    const { hours = 0, minutes = 0, seconds = 0 } = time || {}
    return (
        <View style={styles.timeStatContainer}>
            {hours ? <Text style={styles.textColor}>{hours}</Text> : null}
            <Text style={styles.textColor}>{`${_prependZero(minutes)}:`}</Text>
            <Text style={styles.textColor}>{_prependZero(seconds)}</Text>
        </View>
    )
}

const GameResultCard = ({ stats, openNextGameMenu }) => {
    const {
        mistakes, difficultyLevel, time, hintsUsed,
    } = stats

    const styles = useStyles(getStyles)

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
                <Text style={[styles.congratsText, styles.textColor]} type={TEXT_VARIATIONS.HEADING_SMALL}>
                    Congratulations!
                </Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statContainer}>
                        <Text style={styles.textColor}>Difficulty</Text>
                        <Text style={styles.textColor}>{difficultyLevel}</Text>
                    </View>
                    <View style={styles.statContainer}>
                        <Text style={styles.textColor}>Time</Text>
                        {getTimeView(time, styles)}
                    </View>
                    <View style={styles.statContainer}>
                        <Text style={styles.textColor}>Mistakes</Text>
                        <Text style={styles.textColor}>{mistakes}</Text>
                    </View>
                    {/* <View style={styles.statContainer}>
                        <Text style={styles.textColor}>Hints Used</Text>
                        <Text style={styles.textColor}>{hintsUsed}</Text>
                    </View> */}
                </View>
            </>
        )
    }

    const getGameUnsolvedView = () => {
        if (!new GameState(gameState).isGameUnsolved()) return null
        return (
            <Text style={[styles.gameUnsolvedMsg, styles.textColor]}>
                You have reached the maximum mistakes limit. Better Luck Next Time
            </Text>
        )
    }

    const renderNewGameButton = () => (
        <Button
            label={NEW_GAME}
            onPress={openNextGameMenu}
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
