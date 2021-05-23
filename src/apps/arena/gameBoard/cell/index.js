import React from 'react'
import { View, Text } from 'react-native'
import { Styles } from './style'
import { Touchable, TouchableTypes } from '../../../components/Touchable'
import { CELL_BORDER_WIDTH, CELL_HEIGHT } from '../dimensions'
/**
 * 1. replace div with View
 * 2. use touchable
 * 3. replace ClassName with style
 * 4. remove all "this" keyword
 * 5. prepare Style.js file
 * 8. check for un-necessary rendering
 */

/**
 * 6. pass unique key for each element in the list
 * 8. check for un-necessary rendering
 */

// becoz only 3 notes are there in a row
const looper = []
for(let i=0;i<3;i++) looper.push(i)

const gameState = 'active' // put this in constat somewhere globally
const boxCenterCellRowColCordinates = [1, 4, 7]
const boxOuterCellRowColCordinates = [0, 2, 3, 5, 6, 8]

// test for these default values and their types
export const Cell = ({ 
    row,
    col,
    cellNotes = [],
    cellMainValue = 0, // indicates empty cell
    cellBGColor = null, // change it's name to cellBG color
    mainValueFontColor = null,
    onCellClicked,
    cellKey = '',
}) => {
    // if (row === 0 && col === 0) console.log('@@@@@@@ cellNotes', JSON.stringify(cellNotes))
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

    // TODO: remove this later on
    // using this check to stop putting 9 * 81 extra views if we render the notoes boxes with the empty value
    const shouldRenderNotes = () => {
        return 1
        for(let noteNum=0;noteNum<9;noteNum++){
            const { show } = cellNotes[noteNum]
            if (show) return 1
        }
        return 0
    }

    /**
     * to stop the warning had to put noe emore View component here
     * test for performance decrease due to so many views used in the board compoent
     */
    const getCellNotes = () => {
        // console.log('@@@@@@ render cell notes', row, col)
        const cellNotesRows = looper.map((row) => {
            const cellNotesRow = looper.map((col) => {
                const noteNum = row * 3 + col
                const { show, noteValue } = cellNotes[noteNum] || {}
                // console.log('@@@@@@', show, noteValue)
                return (
                    <View key={`${noteNum}`}>
                        <Text style={Styles.noteText}>
                            {show ? `${noteValue}` : ''} 
                        </Text>
                    </View>
                )
            })
            return <View style={Styles.notesRow} key={`${row}`}>{cellNotesRow}</View>
        })
        return <View style={Styles.notesContainer}>{cellNotesRows}</View>
    }

    const renderCell = () => {
        const containerStyle = [Styles.cell, cellBGColor, getCellBordersStyle(), { borderColor: 'black', }]
        return (
            <Touchable
                touchable={TouchableTypes.opacity}
                activeOpacity={1}
                style={containerStyle}
                onPress={() => gameState === 'active' && onCellClicked(row, col)} // call only if game is on
            >
                {
                    gameState === 'active' ? // read from Global State. let's figure out if redux needs to be used or not (after  understanding it properly)
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
