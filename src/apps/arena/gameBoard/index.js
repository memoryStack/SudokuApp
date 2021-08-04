import React from 'react'
import { View } from 'react-native'
import { Styles } from './style'
import { Cell } from './cell'
import { CELL_HEIGHT, INNER_THICK_BORDER_WIDTH, GAME_BOARD_WIDTH, OUTER_THIN_BORDER_WIDTH } from './dimensions'
import { GAME_STATE } from '../../../resources/constants'
import { sameHouseAsSelected } from '../../../utils/util'

const looper = []
for(let i=0;i<9;i++) {
    if (i%3 === 0 && i !== 0) looper.push(-1)
    looper.push(i)
}

const getThickBorderView = (height, width, key = '') =>
    <View style={[Styles.thickBorder, {height, width}]} key={key} />

export const Board = ({
    gameState,
    mainNumbers,
    notesInfo,
    selectedCell = {},
    selectedCellMainValue = 0,
    onCellClick,
}) => {

    const sameValueAsSelectedBox = (row, col) =>
        selectedCellMainValue && selectedCellMainValue === mainNumbers[row][col].value
    
    const getMainNumFontColor = (row, col) => {
        if (!mainNumbers[row][col].value) return null
        const isWronglyPlaced = mainNumbers[row][col].value !== mainNumbers[row][col].solutionValue
        if (isWronglyPlaced) return Styles.wronglyFilledNumColor
        if (!mainNumbers[row][col].isClue) return Styles.userFilledNumColor
        return Styles.clueNumColor
    }

    const getBoxBackgroundColor = (row, col) => {
        if (gameState === GAME_STATE.INACTIVE) return null
        const { row: selectedCellRow = 0, col: selectedCellCol = 0  } = selectedCell
        const isSameHouseAsSelected = sameHouseAsSelected(row, col, selectedCellRow, selectedCellCol)
        const isSameValueAsSelected = sameValueAsSelectedBox(row, col)
        const isSelected = selectedCellRow === row && selectedCellCol === col
        
        if (isSelected) return Styles.selectedCellBGColor
        if (isSameHouseAsSelected && isSameValueAsSelected) return Styles.sameHouseSameValueBGColor
        if (isSameHouseAsSelected) return Styles.sameHouseCellBGColor
        if (!isSameHouseAsSelected && isSameValueAsSelected) return Styles.diffHouseSameValueBGColor
        return null
    }

    const renderRow = (row, key) => {
        let rowElementsKeyCounter = 0
        return (
            <View style={Styles.rowStyle} key={key}>
                {
                    looper.map((col) => {
                        const elementKey = `${rowElementsKeyCounter++}`
                        if (col === -1) return getThickBorderView(CELL_HEIGHT, INNER_THICK_BORDER_WIDTH, elementKey)
                        return (
                            <View
                                style={Styles.cellContainer}
                                key={elementKey}
                            >
                                <Cell
                                    row={row}
                                    col={col}
                                    cellBGColor={getBoxBackgroundColor(row, col)}
                                    mainValueFontColor={getMainNumFontColor(row, col)}
                                    cellMainValue={mainNumbers[row][col].value}
                                    cellNotes={notesInfo[row][col]}
                                    onCellClicked={onCellClick}
                                    gameState={gameState}
                                />
                            </View>
                        )
                    })
                }
            </View>
        )
    }
    
    const getBoard = () => {
        let keyCounter = 0
        return (
            <View style={Styles.board}> 
                {
                    looper.map( row => {
                        const elementKey = `${keyCounter++}`
                        if (row === -1) return getThickBorderView(INNER_THICK_BORDER_WIDTH, GAME_BOARD_WIDTH - 2 * OUTER_THIN_BORDER_WIDTH, elementKey)
                        return renderRow(row, elementKey)
                    })
                }
            </View>
        )
    }

    return getBoard()
}
