import React from 'react'

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
import _isEqual from '@lodash/isEqual'
import { ANIMATABLE_PROPERTIES } from './animationUtils'
import _isEmpty from '@lodash/isEmpty'
import { useAnimateView } from './useAnimateView'
import CellNumberInput from './CellNumberInput'
import { FONT_WEIGHTS } from '@resources/fonts/font'
import { ViewAnimationConfig } from './animationConfigType'

const CROSS_ICON_AND_CELL_DIMENSION_RATIO = 0.66
// becoz only 3 notes are there in a row
const looper = []
for (let i = 0; i < 3; i++) looper.push(i)

const DEFAULT_ANIMATION_CONFIG = {}

const CellNote = ({
    animationsConfig,
    textStyles,
    refProp,
    noteContainerStyles,
    value,
}) => {

    const { bgColorInterpolation, borderWidthAnim, borderColorInterpolation }
        = useAnimateView(animationsConfig)

    return (
        <Animated.View
            ref={refProp}
            style={[
                noteContainerStyles,
                bgColorInterpolation && { backgroundColor: bgColorInterpolation },
                borderWidthAnim && { borderWidth: borderWidthAnim },
                borderColorInterpolation && { borderColor: borderColorInterpolation }
            ]}
            collapsable={false}
        >
            <CellNumberInput
                testID={CELL_NOTE_TEST_ID}
                textStyles={textStyles}
                value={value}
                type={TEXT_VARIATIONS.BODY_SMALL}
                animationsConfig={animationsConfig}
            />
        </Animated.View>
    )
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
    cellAnimationsConfig,
    animateNumberInsertion,
}) => {
    const { CELL_HEIGHT } = useBoardElementsDimensions()
    const CROSS_ICON_DIMENSION = CELL_HEIGHT * CROSS_ICON_AND_CELL_DIMENSION_RATIO

    console.log('@@@@ cellBGColor', cellBGColor)

    const styles = useStyles(getStyles)

    const shouldRenderNotes = () => cellNotes.some(({ show }) => show)

    const {
        borderWidthAnim,
        bgColorInterpolation: bgColor,
        borderColorInterpolation: borderColor,
    } = useAnimateView({ ...cellAnimationsConfig.mainNumber })

    const getCellNotes = () => {
        if (!shouldRenderNotes()) return null

        const cellNotesRows = looper.map(cellNoteRow => {
            const cellNotesRow = looper.map(cellNoteCol => {
                const noteNum = cellNoteRow * 3 + cellNoteCol
                const { show, noteValue } = cellNotes[noteNum] || {}

                let fontCustomizedStyles = getNoteStyles(cellNotes[noteNum] || {}, { row, col })
                if (fontCustomizedStyles?.fontWeight === FONT_WEIGHTS.HEAVY) {
                    fontCustomizedStyles = {
                        ...fontCustomizedStyles,
                        ...styles.noteTextBold
                    }
                }

                return (
                    <CellNote
                        refProp={notesRefs[noteNum]}
                        key={`${noteNum}`}
                        cellNotes={cellNotes}
                        textStyles={[
                            styles.noteText,
                            fontCustomizedStyles,
                        ]}
                        value={show ? `${noteValue}` : ''}
                        noteContainerStyles={styles.noteContainer}
                        animationsConfig={cellAnimationsConfig?.notes?.[noteValue]}
                    />
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

    // TODO: had to use <Animated.View /> because can't animate color + scale animation 
    // on <Animated.Text /> in parallel (throws errors). try to upgrade react native version    
    const renderCellMainValue = () => (
        <CellNumberInput
            testID={CELL_MAIN_VALUE_TEST_ID}
            textStyles={[
                styles.mainNumberText,
                mainValueFontColor,
            ]}
            value={cellMainValue}
            textType={TEXT_VARIATIONS.HEADING_LARGE}
            withoutLineHeight
            animationsConfig={cellAnimationsConfig.mainNumber}
            animateNumberInsertion={animateNumberInsertion}
            cell={{ row, col }}
            animated
        />
    )

    const getCellContent = () => {
        if (displayCrossIcon) return getCellCrossIcon()
        if (cellMainValue) return renderCellMainValue()
        return getCellNotes()
    }

    return (
        // let's use opacity only, this supports passing null as child as well
        <Touchable
            activeOpacity={1}
            style={[styles.cell]}
            onPress={() => onCellClick({ row, col })}
            testID={BOARD_CELL_TEST_ID}
            animatableStyles={[styles.cell, {
                backgroundColor: bgColor,
                borderWidth: borderWidthAnim,
                borderColor: borderColor
            }]}
            isAnimated
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
    cellAnimationsConfig: PropTypes.shape({
        mainNumber: ViewAnimationConfig,
        notes: PropTypes.objectOf(ViewAnimationConfig)
    }),
    animateNumberInsertion: PropTypes.bool,
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
    cellAnimationsConfig: DEFAULT_ANIMATION_CONFIG,
    animateNumberInsertion: false,
}
