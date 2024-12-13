import React, { useEffect, useRef } from 'react'

import { View, Animated } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { CloseIcon } from '@resources/svgIcons/close'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'
import { Touchable } from '../../../components/Touchable'

import { useBoardElementsDimensions } from '../../hooks/useBoardElementsDimensions'

import { BOARD_CELL_TEST_ID, CELL_MAIN_VALUE_TEST_ID, CELL_NOTE_TEST_ID } from './cell.constants'
import { getStyles } from './cell.styles'
import { usePrevious } from '@utils/customHooks'
import _isEqual from '@lodash/isEqual'
import { ANIMATABLE_PROPERTIES, createAnimationInstance } from './animationUtils'
import _isEmpty from '@lodash/isEmpty'

const CROSS_ICON_AND_CELL_DIMENSION_RATIO = 0.66
// becoz only 3 notes are there in a row
const looper = []
for (let i = 0; i < 3; i++) looper.push(i)

const DEFAULT_ANIMATION_CONFIG = {}

const DEFAULT_ANIMATION_VALUES = {
    [ANIMATABLE_PROPERTIES.FONT_SIZE]: 1,
    [ANIMATABLE_PROPERTIES.TEXT_COLOR]: 0,
    [ANIMATABLE_PROPERTIES.BG_COLOR]: 0,
    [ANIMATABLE_PROPERTIES.BORDER_WIDTH]: 0,
    [ANIMATABLE_PROPERTIES.BORDER_COLOR]: 0,
}

const ANIMATION_TRANSITION_VALUES = {
    [ANIMATABLE_PROPERTIES.FONT_SIZE]: {
        from: DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.FONT_SIZE],
        to: -1
    },
    [ANIMATABLE_PROPERTIES.TEXT_COLOR]: {
        from: DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.TEXT_COLOR],
        to: -1
    },
    [ANIMATABLE_PROPERTIES.BG_COLOR]: {
        from: DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.BG_COLOR],
        to: -1
    },
    [ANIMATABLE_PROPERTIES.BORDER_WIDTH]: {
        from: DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.BORDER_WIDTH],
        to: -1
    },
    [ANIMATABLE_PROPERTIES.BORDER_COLOR]: {
        from: DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.BORDER_COLOR],
        to: -1
    },
}

// test for these default values and their types
const Cell_ = ({
    row,
    col,
    cellNotes,
    cellMainValue,
    cellBGColor,
    mainValueFontColor,
    onCellClick,
    showCellContent,
    displayCrossIcon,
    crossIconColor,
    notesRefs,
    getNoteStyles,
    cellAnimationsConfig = DEFAULT_ANIMATION_CONFIG,
}) => {
    const { CELL_HEIGHT } = useBoardElementsDimensions()
    const CROSS_ICON_DIMENSION = CELL_HEIGHT * CROSS_ICON_AND_CELL_DIMENSION_RATIO

    const mainNumberFontAnim = useRef(new Animated.Value(DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.FONT_SIZE])).current
    const mainNumberColorAnim = useRef(new Animated.Value(DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.TEXT_COLOR])).current // it's text color
    const bgColorAnim = useRef(new Animated.Value(DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.BG_COLOR])).current
    const borderWidthAnim = useRef(new Animated.Value(DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.BORDER_WIDTH])).current
    const borderColorAnim = useRef(new Animated.Value(DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.BORDER_COLOR])).current

    const ANIMATED_PROPERTY_VS_ANIM_VALUE = {
        [ANIMATABLE_PROPERTIES.FONT_SIZE]: mainNumberFontAnim,
        [ANIMATABLE_PROPERTIES.TEXT_COLOR]: mainNumberColorAnim,
        [ANIMATABLE_PROPERTIES.BG_COLOR]: bgColorAnim,
        [ANIMATABLE_PROPERTIES.BORDER_WIDTH]: borderWidthAnim,
        [ANIMATABLE_PROPERTIES.BORDER_COLOR]: borderColorAnim,
    }

    const originalAnimatedValuesBeforeAnimationStarted = useRef(ANIMATION_TRANSITION_VALUES).current

    const styles = useStyles(getStyles)

    const animationObj = useRef({})

    const shouldRenderNotes = () => cellNotes.some(({ show }) => show)

    const previousAnimationsConfig = usePrevious(cellAnimationsConfig)

    const animationConfigsMerge = useRef({})

    animationConfigsMerge.current = {
        ...animationConfigsMerge.current,
        ...previousAnimationsConfig,
        ...cellAnimationsConfig
    }

    useEffect(() => {
        const allAnimations = animationConfigsMerge.current
        const listenersIDs = []
        Object.keys(allAnimations).forEach((animatableProperty) => {
            // TODO: add check for animatableProperty if that's supported or not
            if (allAnimations[animatableProperty].stop) {
                const animationInstance = animationObj.current[animatableProperty]
                animationInstance && animationInstance.stop()
            } else if (allAnimations[animatableProperty].start) {
                const animationInstance = animationObj.current[animatableProperty]
                animationInstance && animationInstance.start()
            } else {
                // add safety checks in case animation instance is not returned
                const animation = createAnimationInstance(
                    ANIMATED_PROPERTY_VS_ANIM_VALUE[animatableProperty],
                    originalAnimatedValuesBeforeAnimationStarted[animatableProperty].from,
                    animatableProperty,
                    allAnimations[animatableProperty]
                )

                animation.start()

                animationObj.current[animatableProperty] = animation
                // WARN: don't move the below .from update logic above createAnimationInstance function
                if (originalAnimatedValuesBeforeAnimationStarted[animatableProperty].to !== -1) {
                    originalAnimatedValuesBeforeAnimationStarted[animatableProperty].from
                        = originalAnimatedValuesBeforeAnimationStarted[animatableProperty].to
                }
                ANIMATED_PROPERTY_VS_ANIM_VALUE[animatableProperty].addListener(({ value }) => {
                    if (!Number.isNaN(value)) {
                        originalAnimatedValuesBeforeAnimationStarted[animatableProperty].to = value
                    }
                })

                listenersIDs.push(ANIMATED_PROPERTY_VS_ANIM_VALUE[animatableProperty])
            }
        })

        return () => {
            Object.keys(allAnimations).forEach((animatableProperty) => {
                const animatedValue = ANIMATED_PROPERTY_VS_ANIM_VALUE[animatableProperty]
                animatedValue.stopAnimation()
                animatedValue.removeAllListeners()
            })
        }
    }, [cellAnimationsConfig, previousAnimationsConfig])

    const getCellNotes = () => {
        if (!shouldRenderNotes()) return null

        const cellNotesRows = looper.map(cellNoteRow => {
            const cellNotesRow = looper.map(cellNoteCol => {
                const noteNum = cellNoteRow * 3 + cellNoteCol
                const { show, noteValue } = cellNotes[noteNum] || {}

                return (
                    <View
                        key={`${noteNum}`}
                        ref={notesRefs[noteNum]}
                        style={styles.noteContainer}
                        collapsable={false}
                    >
                        <Text
                            style={[
                                styles.noteText,
                                getNoteStyles(cellNotes[noteNum] || {}, { row, col }),
                            ]}
                            testID={CELL_NOTE_TEST_ID}
                            type={TEXT_VARIATIONS.BODY_SMALL}
                            withoutLineHeight
                        >
                            {show ? `${noteValue}` : ''}
                        </Text>
                    </View>
                )
            })
            return (
                <View style={styles.notesRow} key={`${cellNoteRow}`}>
                    {cellNotesRow}
                </View>
            )
        })
        return cellNotesRows
    }

    const getCellCrossIcon = () => (
        <CloseIcon
            height={CROSS_ICON_DIMENSION}
            width={CROSS_ICON_DIMENSION}
            fill={crossIconColor}
        />
    )

    // JUST GET THE CONFIG FOR OUTPUT
    const mainNumberColorInterpolation = animationConfigsMerge.current['textColor']?.output ? mainNumberColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: animationConfigsMerge.current['textColor']?.output
    }) : undefined
    const bgColor = animationConfigsMerge.current['bgColor']?.output ? bgColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: animationConfigsMerge.current['bgColor']?.output
    }) : undefined
    const borderColor = animationConfigsMerge.current['borderColor']?.output ? borderColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: animationConfigsMerge.current['borderColor']?.output
    }) : undefined

    // TODO: had to use <Animated.View /> because can't animate color + scale animation 
    // on <Animated.Text /> in parallel (throws errors). try to upgrade react native version
    const renderCellMainValue = () => (
        <Animated.View style={{ transform: [{ scale: ANIMATED_PROPERTY_VS_ANIM_VALUE[ANIMATABLE_PROPERTIES.FONT_SIZE] }] }}>
            <Text
                style={[
                    styles.mainNumberText,
                    mainValueFontColor,
                    mainNumberColorInterpolation && { color: mainNumberColorInterpolation }
                ]}
                testID={CELL_MAIN_VALUE_TEST_ID}
                type={TEXT_VARIATIONS.HEADING_LARGE}
                withoutLineHeight
                animated={ANIMATABLE_PROPERTIES.TEXT_COLOR in animationConfigsMerge.current}
            >
                {cellMainValue}
            </Text>
        </Animated.View>
    )

    const getCellContent = () => {
        if (displayCrossIcon) return getCellCrossIcon()
        if (cellMainValue) return renderCellMainValue()
        return getCellNotes()
    }

    const animateCell = [
        ANIMATABLE_PROPERTIES.BG_COLOR,
        ANIMATABLE_PROPERTIES.BORDER_WIDTH,
        ANIMATABLE_PROPERTIES.BORDER_COLOR,
    ].some((animatableProperty) => {
        return animatableProperty in animationConfigsMerge.current
    })

    return (
        // let's use opacity only, this supports passing null as child as well
        <Touchable
            activeOpacity={1}
            style={[styles.cell, cellBGColor]}
            onPress={() => onCellClick({ row, col })}
            testID={BOARD_CELL_TEST_ID}
            isAnimated={animateCell}
            animatableStyles={[styles.cell, { backgroundColor: bgColor, borderWidth: borderWidthAnim, borderColor: borderColor }]}
        >
            {showCellContent ? getCellContent() : null}
        </Touchable>
    )
}

export const Cell = React.memo(Cell_)

Cell_.propTypes = {
    row: PropTypes.number,
    col: PropTypes.number,
    cellNotes: PropTypes.array,
    cellMainValue: PropTypes.number,
    cellBGColor: PropTypes.object,
    mainValueFontColor: PropTypes.object,
    onCellClick: PropTypes.func,
    showCellContent: PropTypes.bool,
    displayCrossIcon: PropTypes.bool,
    crossIconColor: PropTypes.string,
    notesRefs: PropTypes.array,
    getNoteStyles: PropTypes.func,
}

Cell_.defaultProps = {
    row: 0,
    col: 0,
    cellNotes: [],
    cellMainValue: 0,
    cellBGColor: null,
    mainValueFontColor: null,
    onCellClick: _noop,
    showCellContent: true,
    displayCrossIcon: false,
    crossIconColor: '',
    notesRefs: [],
    getNoteStyles: _noop,
}
