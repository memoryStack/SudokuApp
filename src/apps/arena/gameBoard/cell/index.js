import React from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { CloseIcon } from '@resources/svgIcons/close'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'
import { Touchable } from '../../../components/Touchable'

import { useBoardElementsDimensions } from '../../hooks/useBoardElementsDimensions'

import { BOARD_CELL_TEST_ID, CELL_MAIN_VALUE_TEST_ID, CELL_NOTE_TEST_ID } from './cell.constants'
import { getStyles } from './cell.styles'

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
    crossIconColor,
    notesRefs,
    getNoteStyles,
}) => {
    const { CELL_HEIGHT } = useBoardElementsDimensions()
    const CROSS_ICON_DIMENSION = CELL_HEIGHT * CROSS_ICON_AND_CELL_DIMENSION_RATIO

    const styles = useStyles(getStyles)

    const shouldRenderNotes = () => cellNotes.some(({ show }) => show)

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

    const renderCellMainValue = () => (
        <Text
            style={[styles.mainNumberText, mainValueFontColor]}
            testID={CELL_MAIN_VALUE_TEST_ID}
            type={TEXT_VARIATIONS.HEADING_LARGE}
            withoutLineHeight
        >
            {cellMainValue}
        </Text>
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
