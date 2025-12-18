import React, { useCallback } from 'react'

import { View, StyleSheet } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'
import get from '@lodash/get'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'
import Button, { BUTTON_TYPES } from '@ui/molecules/Button'

import { useStyles } from '@utils/customHooks/useStyles'

import { Timer as TimeManager } from '@utils/classes/timer'

import { useTranslation } from '../../../i18n/hooks/useTranslation'
import { useDependency } from '../../../hooks/useDependency'
import withActions from '../../../utils/hocs/withActions'

import { Timer } from '../timer'

import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'
import { MISTAKES_TEXT_TEST_ID, PUZZLE_LEVEL_TEXT_TEST_ID } from './refree.constants'
import { STATIC_BOARD_ELEMENTS_DIMENSIONS } from '../constants'
import { START_GAME_MENU_ITEMS_IDS } from '@application/usecases/newGameMenu/constants'
import { NEW_GAME_IDS } from '@application/usecases/newGameMenu/constants'

const getStyles = ({ BOARD_GRID_WIDTH }, theme) => StyleSheet.create({
    refereeContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: BOARD_GRID_WIDTH,
        marginBottom: 8,
        marginLeft: STATIC_BOARD_ELEMENTS_DIMENSIONS.AXIS_WIDTH_HALVE
    },
    textColor: {
        color: get(theme, ['colors', 'on-surface-variant-low']),
    },
})

const Refree_ = ({ timer, onAction, maxMistakesLimit, mistakes, difficultyLevelID, time, containerStyles }) => {
    const dependencies = useDependency()

    const styles = useStyles(getStyles)
    const { t } = useTranslation('arena')

    const PUZZLE_LEVEL_TEXT = {
        [START_GAME_MENU_ITEMS_IDS.EASY]: t('nextGameMenu.easy', 'EASY'),
        [START_GAME_MENU_ITEMS_IDS.MEDIUM]: t('nextGameMenu.medium', 'MEDIUM'),
        [START_GAME_MENU_ITEMS_IDS.HARD]: t('nextGameMenu.hard', 'HARD'),
        [START_GAME_MENU_ITEMS_IDS.EXPERT]: t('nextGameMenu.expert', 'EXPERT'),
        [START_GAME_MENU_ITEMS_IDS.CUSTOMIZE_PUZZLE]: t('refree.customizedPuzzle', 'Customized Puzzle'),
        [NEW_GAME_IDS.SHARED_PUZZLE]: t('refree.sharedPuzzle', 'Shared Puzzle'),
    }

    const onTimerClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_TIMER_CLICK, payload: { dependencies } })
    }, [onAction, dependencies])

    const showTimer = dependencies?.gameSettingsAdapter?.showTimer()

    const showPlayCTA = !timer.isActive()

    const renderMistakesView = () => {
        const { gameSettingsAdapter } = dependencies
        const gameOverOnMistakesThresholdCrossed = gameSettingsAdapter.shouldGameOverOnMistakesThresholdCrossed()
        const mistakeFeedbackOn = gameSettingsAdapter.showFeedbackOnMistake()
        if (!mistakeFeedbackOn) return null

        let mistakesText = ''
        if (gameOverOnMistakesThresholdCrossed) {
            mistakesText = t('refree.mistakesWithLimit', { current: mistakes, max: maxMistakesLimit })
        } else {
            mistakesText = t('refree.mistakesWithoutLimit', { current: mistakes })
        }
        return (
            <Text style={styles.textColor} testID={MISTAKES_TEXT_TEST_ID} type={TEXT_VARIATIONS.BODY_MEDIUM}>
                {mistakesText}
            </Text>
        )
    }

    return (
        <View style={[styles.refereeContainer, containerStyles]}>
            {renderMistakesView()}
            {!showTimer ?
                <Button
                    label={showPlayCTA ? t('common:play', 'Play') : t('common:pause', 'Pause')}
                    onPress={onTimerClick}
                    avoidDefaultContainerStyles
                    textStyles={styles.footerButtonText}
                    type={BUTTON_TYPES.TEXT}
                />
                : null
            }
            <Text
                style={styles.textColor}
                type={TEXT_VARIATIONS.BODY_MEDIUM}
                testID={PUZZLE_LEVEL_TEXT_TEST_ID}
            >
                {PUZZLE_LEVEL_TEXT[difficultyLevelID]}
            </Text>
            {showTimer ? <Timer time={time} onClick={onTimerClick} /> : null}
        </View>
    )
}

export default React.memo(withActions({ actionHandlers: ACTION_HANDLERS })(Refree_))

Refree_.propTypes = {
    onAction: PropTypes.func,
    // eslint-disable-next-line react/no-unused-prop-types
    timer: PropTypes.instanceOf(TimeManager).isRequired,
    containerStyles: PropTypes.style
}

Refree_.defaultProps = {
    onAction: _noop,
}
