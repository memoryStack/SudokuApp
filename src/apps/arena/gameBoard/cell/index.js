import React from 'react'
import { View, Text } from 'react-native'
import { Styles } from './style'
import { Touchable, TouchableTypes } from '../../../components/Touchable'
import { CELL_BORDER_WIDTH } from '../dimensions'
import { GAME_STATE } from '../../../../resources/constants'

// becoz only 3 notes are there in a row
const looper = []
for(let i=0;i<3;i++) looper.push(i)

const boxCenterCellRowColCordinates = [1, 4, 7]
const boxOuterCellRowColCordinates = [0, 2, 3, 5, 6, 8]

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
}) => {
    const getCellBordersStyle = () => {
        if (boxOuterCellRowColCordinates.indexOf(row) !== -1 && boxOuterCellRowColCordinates.indexOf(col) !== -1) {
            return {}
        }
        if (boxCenterCellRowColCordinates.indexOf(row) !== -1 && boxCenterCellRowColCordinates.indexOf(col) !== -1) {
            return {
                borderWidth: CELL_BORDER_WIDTH,
            }
        }
        if (boxCenterCellRowColCordinates.indexOf(row) !== -1 && boxOuterCellRowColCordinates.indexOf(col) !== -1) {
            return {
                borderTopWidth: CELL_BORDER_WIDTH,
                borderBottomWidth: CELL_BORDER_WIDTH,
            }
        }
        if (boxOuterCellRowColCordinates.indexOf(row) !== -1 && boxCenterCellRowColCordinates.indexOf(col) !== -1) {
            return {
                borderRightWidth: CELL_BORDER_WIDTH,
                borderLeftWidth: CELL_BORDER_WIDTH,
            }
        }
        return {}
    }

    const shouldRenderNotes = () => {
        for(let noteNum=0;noteNum<9;noteNum++){
            const { show } = cellNotes[noteNum]
            if (show) return 1
        }
        return 0
    }

    const getCellNotes = () => {
        const cellNotesRows = looper.map((row) => {
            const cellNotesRow = looper.map((col) => {
                const noteNum = row * 3 + col
                const { show, noteValue } = cellNotes[noteNum] || {}
                return (
                    <View key={`${noteNum}`}>
                        <Text style={Styles.noteText}>
                            {show ? `${noteValue}` : ' '} 
                        </Text>
                    </View>
                )
            })
            return <View style={Styles.notesRow} key={`${row}`}>{cellNotesRow}</View>
        })
        return <View style={Styles.notesContainer}>{cellNotesRows}</View>
    }

    const onPress = () =>
        gameState === GAME_STATE.ACTIVE && onCellClicked(row, col)

    const renderCell = () => {
        const containerStyle = [Styles.cell, cellBGColor, getCellBordersStyle(), { borderColor: 'black' }]
        return (
            <Touchable
                touchable={TouchableTypes.opacity}
                activeOpacity={1}
                style={containerStyle}
                onPress={onPress}
            >
                {
                    gameState !== GAME_STATE.INACTIVE ?
                        (
                            cellMainValue ?
                                <Text style={[Styles.mainNumberText, mainValueFontColor]}> {`${cellMainValue}`} </Text>
                            : shouldRenderNotes() ? getCellNotes(row, col) : null
                        )
                    : null
                }
            </Touchable>
        )
    }

    return renderCell()
}

export const Cell = React.memo(Cell_)