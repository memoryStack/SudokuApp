import React, { useMemo } from 'react'
import { View, Text } from 'react-native'
import { getStyles } from './style'
import { Touchable, TouchableTypes } from '../../../components/Touchable'
import { GAME_STATE } from '../../../../resources/constants'
import { CloseIcon } from '../../../../resources/svgIcons/close'
import { COLOR_SCHEME_STYLES as boardColorStyles } from '../style'
import { fonts } from '../../../../resources/fonts/font'
import { useBoardElementsDimensions } from '../../../../utils/customHooks/boardElementsDimensions'
import { consoleLog } from '../../../../utils/util'

const CROSS_ICON_AND_CELL_DIMENSION_RATIO = 0.66
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
    selectedMainNumber = 0,
    showSmartHint,
}) => {
    const { CELL_HEIGHT } = useBoardElementsDimensions()
    const CROSS_ICON_DIMENSION = CELL_HEIGHT * CROSS_ICON_AND_CELL_DIMENSION_RATIO

    const styles = useMemo(() => {
        return getStyles(CELL_HEIGHT)
    }, [CELL_HEIGHT])

    const shouldRenderNotes = () => {
        for (let noteNum = 0; noteNum < 9; noteNum++) if (cellNotes[noteNum].show) return 1
        return 0
    }

    const getNotesFontColor = noteValue => {
        if (showSmartHint) {
            const { notesToHighlightData: { [`${noteValue}`]: { fontColor = null } = {} } = {} } = smartHintData || {}
            return fontColor
        }
        // remove it later or make it better for practice sessions
        if (__DEV__ && noteValue === selectedMainNumber) {
            return 'red'
        }
    }

    const getCellNotes = () => {
        const cellNotesRows = looper.map(row => {
            const cellNotesRow = looper.map(col => {
                const noteNum = row * 3 + col
                const { show, noteValue } = cellNotes[noteNum] || {}
                const noteFontColor = show ? getNotesFontColor(noteValue) : null
                return (
                    <View key={`${noteNum}`} style={styles.noteContainer}>
                        <Text
                            style={[
                                styles.noteText,
                                noteFontColor ? { color: noteFontColor, fontFamily: fonts.bold } : null,
                            ]}
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
        return <>{cellNotesRows}</>
    }

    const getCellContent = () => {
        if (displayCrossIcon) {
            return (
                <CloseIcon
                    height={CROSS_ICON_DIMENSION}
                    width={CROSS_ICON_DIMENSION}
                    fill={boardColorStyles.wronglyFilledNumColor.color}
                />
            )
        }

        return cellMainValue ? (
            <Text style={[styles.mainNumberText, mainValueFontColor]}> {`${cellMainValue}`} </Text>
        ) : shouldRenderNotes() ? (
            getCellNotes()
        ) : null
    }

    return (
        <Touchable
            touchable={TouchableTypes.opacity}
            activeOpacity={1}
            style={[styles.cell, cellBGColor]}
            onPress={() => onCellClicked({ row, col })}
        >
            {gameState !== GAME_STATE.INACTIVE ? getCellContent() : null}
        </Touchable>
    )
}

export const Cell = React.memo(Cell_)
