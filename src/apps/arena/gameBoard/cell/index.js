import React, { useMemo } from 'react'

import { View, Text } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'
import _get from '@lodash/get'

import { CloseIcon } from '@resources/svgIcons/close'
import { fonts } from '@resources/fonts/font'

import { Touchable } from '../../../components/Touchable'

import { useBoardElementsDimensions } from '../../hooks/useBoardElementsDimensions'

import { COLOR_SCHEME_STYLES as boardColorStyles } from '../style'

import { BOARD_CELL_TEST_ID, CELL_MAIN_VALUE_TEST_ID, CELL_NOTE_TEST_ID } from './cell.constants'
import { getStyles } from './style'

const CROSS_ICON_AND_CELL_DIMENSION_RATIO = 0.66
// becoz only 3 notes are there in a row
const looper = []
for (let i = 0; i < 3; i++) looper.push(i)

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
    smartHintData,
    selectedMainNumber,
    showSmartHint,
    notesRefs,
}) => {
    const { CELL_HEIGHT } = useBoardElementsDimensions()
    const CROSS_ICON_DIMENSION = CELL_HEIGHT * CROSS_ICON_AND_CELL_DIMENSION_RATIO

    const styles = useMemo(() => getStyles(CELL_HEIGHT), [CELL_HEIGHT])

    const shouldRenderNotes = () => cellNotes.some(({ show }) => show)

    const getNotesFontColor = noteValue => {
        if (showSmartHint || true) {
            return _get(smartHintData, ['notesToHighlightData', noteValue, 'fontColor'], null)
        }
        // remove it later or make it better for practice sessions
        if (__DEV__ && noteValue === selectedMainNumber) {
            return 'red'
        }
    }

    const getCellNotes = () => {
        if (!shouldRenderNotes()) return null

        const cellNotesRows = looper.map(row => {
            const cellNotesRow = looper.map(col => {
                const noteNum = row * 3 + col
                const { show, noteValue } = cellNotes[noteNum] || {}
                const noteFontColor = show ? getNotesFontColor(noteValue) : null

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
                                noteFontColor ? { color: noteFontColor, fontFamily: fonts.bold } : null,
                            ]}
                            testID={CELL_NOTE_TEST_ID}
                        >
                            {show ? `${noteValue}` : ''}
                        </Text>
                    </View>
                )
            })
            return (
                <View style={styles.notesRow} key={`${row}`}>
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
            fill={boardColorStyles.wronglyFilledNumColor.color}
        />
    )

    const renderCellMainValue = () => (
        <Text style={[styles.mainNumberText, mainValueFontColor]} testID={CELL_MAIN_VALUE_TEST_ID}>
            {' '}
            {`${cellMainValue}`}
            {' '}
        </Text>
    )

    const getCellNumberView = () => {
        if (cellMainValue) return renderCellMainValue()
        return getCellNotes()
    }

    const getCellContent = () => {
        if (displayCrossIcon) return getCellCrossIcon()
        return getCellNumberView()
    }

    return (
        // let's use opacity only, this supports passing null as child as well
        <Touchable
            activeOpacity={1}
            style={[styles.cell, cellBGColor]}
            onPress={() => onCellClick({ row, col })}
            testID={BOARD_CELL_TEST_ID}
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
    smartHintData: PropTypes.object,
    selectedMainNumber: PropTypes.number,
    showSmartHint: PropTypes.bool,
    notesRefs: PropTypes.array,
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
    smartHintData: {},
    selectedMainNumber: 0,
    showSmartHint: false,
    notesRefs: [],
}
