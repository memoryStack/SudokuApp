import React, { useCallback } from 'react'

import { View, StyleSheet } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'
import get from '@lodash/get'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'
import Button, { BUTTON_TYPES } from '@ui/molecules/Button'

import { useStyles } from '@utils/customHooks/useStyles'

import { Timer as TimeManager } from '@utils/classes/timer'

import { useDependency } from '../../../hooks/useDependency'
import withActions from '../../../utils/hocs/withActions'

import { Timer } from '../timer'

import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'
import { MISTAKES_TEXT_TEST_ID, PUZZLE_LEVEL_TEXT, PUZZLE_LEVEL_TEXT_TEST_ID } from './refree.constants'

const getStyles = (_, theme) => StyleSheet.create({
    refereeContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '94%',
        marginBottom: 8,
        paddingLeft: 20
    },
    textColor: {
        color: get(theme, ['colors', 'on-surface-variant-low']),
    },
})

const Refree_ = ({ timer, onAction, maxMistakesLimit, mistakes, difficultyLevelID, time, containerStyles }) => {
    const dependencies = useDependency()

    const styles = useStyles(getStyles)

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
            mistakesText = `Mistakes: ${mistakes}/${maxMistakesLimit}`
        } else {
            mistakesText = `Mistakes: ${mistakes}`
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
                    label={showPlayCTA ? 'Play' : 'Pause'}
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
