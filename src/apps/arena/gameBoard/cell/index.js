import React from 'react'
import { View, Text } from 'react-native'
import { Styles } from './style'
import { Touchable, TouchableTypes } from '../../../components/Touchable'
import { GAME_STATE } from '../../../../resources/constants'
import { CloseIcon } from '../../../../resources/svgIcons/close'
import { CELL_HEIGHT } from '../dimensions'
import { Styles as boardStyles } from '../style'
import { fonts } from '../../../../resources/fonts/font'

const CROSS_ICON_AND_CELL_DIMENSION_RATIO = 0.66
const CROSS_ICON_DIMENSION = CELL_HEIGHT * CROSS_ICON_AND_CELL_DIMENSION_RATIO
// becoz only 3 notes are there in a row
const looper = []
for (let i = 0; i < 3; i++) looper.push(i)

// test for these default values and their types
const Cell_ = ({
    row,
    col,
    cellNotes = [],
    cellMainValue = 0,
    cellBGColor = null,
    mainValueFontColor = null,
    onCellClicked,
    gameState,
    displayCrossIcon = false,
    smartHintData,
}) => {
    const shouldRenderNotes = () => {
        for (let noteNum = 0; noteNum < 9; noteNum++) if (cellNotes[noteNum].show) return 1
        return 0
    }

    const getNotesFontColor = noteValue => {
        const { notesToHighlightData: { [`${noteValue}`]: { fontColor = null } = {} } = {} } = smartHintData || {}
        return fontColor
    }

    const getCellNotes = () => {
        const cellNotesRows = looper.map(row => {
            const cellNotesRow = looper.map(col => {
                const noteNum = row * 3 + col
                const { show, noteValue } = cellNotes[noteNum] || {}
                const noteFontColor = show && smartHintData ? getNotesFontColor(noteValue) : null
                return (
                    <View key={`${noteNum}`} style={Styles.noteContainer}>
                        <Text
                            style={[
                                Styles.noteText,
                                noteFontColor ? { color: noteFontColor, fontFamily: fonts.bold } : null,
                            ]}
                        >
                            {show ? `${noteValue}` : ''}
                        </Text>
                    </View>
                )
            })
            return (
                <View style={Styles.notesRow} key={`${row}`}>
                    {cellNotesRow}
                </View>
            )
        })
        return <>{cellNotesRows}</>
    }

    const getCellContent = () => {
        if (displayCrossIcon) {
            return (
                <CloseIcon
                    height={CROSS_ICON_DIMENSION}
                    width={CROSS_ICON_DIMENSION}
                    fill={boardStyles.wronglyFilledNumColor.color}
                />
            )
        }

        return cellMainValue ? (
            <Text style={[Styles.mainNumberText, mainValueFontColor]}> {`${cellMainValue}`} </Text>
        ) : shouldRenderNotes() ? (
            getCellNotes(row, col)
        ) : null
    }

    return (
        <Touchable
            touchable={TouchableTypes.opacity}
            activeOpacity={1}
            style={[Styles.cell, cellBGColor]}
            onPress={() => onCellClicked(row, col)}
        >
            {gameState !== GAME_STATE.INACTIVE ? getCellContent() : null}
        </Touchable>
    )
}

export const Cell = React.memo(Cell_)
