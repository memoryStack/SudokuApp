import React from 'react'
import { View } from 'react-native'
import { Styles } from './style'
import { Cell } from './cell'
import { CELL_HEIGHT, INNER_THICK_BORDER_WIDTH, GAME_BOARD_WIDTH, OUTER_THIN_BORDER_WIDTH } from './dimensions'
import { GAME_STATE } from '../../../resources/constants'
import { sameHouseAsSelected } from '../../../utils/util'

const looper = []
const bordersLooper = []
for(let i=0;i<10;i++) {
    if (i < 9) looper.push(i) // 9 cells are there in a row
    bordersLooper.push(i) // 10 borders will be drawn
}

const THICK_BODER_THICKNESS = 3
const Board_ = ({
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
                        return (
                            <View
                                style={Styles.cellContainer}
                                key={`${rowElementsKeyCounter++}`}
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
    
    const getGrid = orientation => {
        const isVertical = orientation === 'vertical'
        const orientationBasedStyles = { flexDirection: isVertical ? 'row' : 'column' }
        const normalBorderStyle = isVertical ? Styles.verticalBars : Styles.horizontalBars
        const thickNessStyleField = isVertical ? 'width' : 'height'
        const thickBorderStyle = {
            ...normalBorderStyle,
            [thickNessStyleField]: THICK_BODER_THICKNESS,
        }

        return (
            <View
                style={[Styles.gridBorderContainer, orientationBasedStyles]}
                pointerEvents={'none'}
            >
                {
                    bordersLooper.map((borderNum) => {
                        const boldBorder = borderNum === 3 || borderNum === 6
                        const borderViewStyle = boldBorder ? thickBorderStyle : normalBorderStyle
                        return <View key={`${orientation}_${borderNum}`} style={borderViewStyle} />
                    })
                }
            </View>
        )
    }

    const getBoard = () => {
        let keyCounter = 0
        return (
            <View style={Styles.board}>
                {looper.map(row => renderRow(row, `${keyCounter++}`))}
                {getGrid('horizontal')}
                {getGrid('vertical')}
            </View>
        )
    }

    return getBoard()
}

export const Board = React.memo(Board_)