import React, { useMemo } from 'react'
import { View } from 'react-native'
import { getStyles } from './style'
import { Cell } from './cell'
import { GAME_STATE, SCREEN_NAME } from '../../../resources/constants'
import { sameHouseAsSelected } from '../../../utils/util'
import {
    useBoardElementsDimensions,
    INNER_THICK_BORDER_WIDTH,
} from '../../../utils/customHooks/boardElementsDimensions'
import { useSelector } from 'react-redux'
import { getHintHCInfo } from '../store/selectors/smartHintHC.selectors'

const looper = []
const bordersLooper = []
for (let i = 0; i < 10; i++) {
    if (i < 9) looper.push(i) // 9 cells are there in a row
    bordersLooper.push(i) // 10 borders will be drawn
}

const Board_ = ({
    screenName = SCREEN_NAME.ARENA, // default will be arena
    gameState,
    mainNumbers,
    notesInfo = [],
    selectedCell = {},
    selectedCellMainValue = 0,
    onCellClick,
}) => {

    const {
        show: showSmartHint,
        hint: {
            cellsToFocusData: smartHintCellsHighlightInfo = {}
        } = {},
    } = useSelector( getHintHCInfo )


    const { GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT } = useBoardElementsDimensions()

    const Styles = useMemo(() => {
        return getStyles({ GAME_BOARD_HEIGHT, GAME_BOARD_WIDTH })
    }, [GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT])

    const sameValueAsSelectedBox = cell =>
        selectedCellMainValue && selectedCellMainValue === mainNumbers[cell.row][cell.col].value

    const getCustomPuzzleMainNumFontColor = cell => {
        const isWronglyPlaced = mainNumbers[cell.row][cell.col].wronglyPlaced
        if (isWronglyPlaced) return Styles.wronglyFilledNumColor
        // consider any other number as clue
        return Styles.clueNumColor
    }

    const getMainNumFontColor = cell => {
        const { row, col } = cell
        if (!mainNumbers[row][col].value) return null
        if (screenName === SCREEN_NAME.CUSTOM_PUZZLE) return getCustomPuzzleMainNumFontColor(cell)
        const isWronglyPlaced = mainNumbers[row][col].value !== mainNumbers[row][col].solutionValue
        if (isWronglyPlaced) return Styles.wronglyFilledNumColor
        if (!mainNumbers[row][col].isClue) return Styles.userFilledNumColor
        return Styles.clueNumColor
    }

    const getSmartHintActiveBgColor = cell => {
        const { row, col } = cell
        return (
            (smartHintCellsHighlightInfo[row] &&
                smartHintCellsHighlightInfo[row][col] &&
                smartHintCellsHighlightInfo[row][col].bgColor) ||
            Styles.smartHintOutOfFocusBGColor
        )
    }

    // this is going to get complicated, i guess it's better to break it
    const getBoxBackgroundColor = cell => {
        const { row, col } = cell
        if (showSmartHint) return getSmartHintActiveBgColor(cell)

        if (gameState === GAME_STATE.INACTIVE) return null
        const { row: selectedCellRow = 0, col: selectedCellCol = 0 } = selectedCell
        const isSelected = selectedCellRow === row && selectedCellCol === col

        if (isSelected) return Styles.selectedCellBGColor
        const isSameHouseAsSelected = sameHouseAsSelected(cell, { row: selectedCellRow, col: selectedCellCol })
        const isSameValueAsSelected = sameValueAsSelectedBox(cell)
        if (isSameHouseAsSelected && isSameValueAsSelected) return Styles.sameHouseSameValueBGColor
        if (screenName === SCREEN_NAME.CUSTOM_PUZZLE) return null // won't show backgorund color for the below type of cells
        if (isSameHouseAsSelected) return Styles.sameHouseCellBGColor
        if (!isSameHouseAsSelected && isSameValueAsSelected) return Styles.diffHouseSameValueBGColor
        return Styles.defaultCellBGColor
    }

    const shouldMarkCellAsInhabitable = cell => {
        if (!showSmartHint) return false
        return !!(
            smartHintCellsHighlightInfo[cell.row] &&
            smartHintCellsHighlightInfo[cell.row][cell.col] &&
            smartHintCellsHighlightInfo[cell.row][cell.col].inhabitable
        )
    }

    const renderRow = (row, key) => {
        let rowElementsKeyCounter = 0
        return (
            <View style={Styles.rowStyle} key={key}>
                {looper.map(col => {
                    const smartHintData = smartHintCellsHighlightInfo[row] && smartHintCellsHighlightInfo[row][col]
                    const cell = { row, col }
                    return (
                        <View style={Styles.cellContainer} key={`${rowElementsKeyCounter++}`}>
                            <Cell
                                row={row}
                                col={col}
                                cellBGColor={getBoxBackgroundColor(cell)}
                                mainValueFontColor={getMainNumFontColor(cell)}
                                cellMainValue={mainNumbers[row][col].value}
                                cellNotes={notesInfo[row][col]}
                                onCellClicked={onCellClick}
                                gameState={gameState}
                                displayCrossIcon={shouldMarkCellAsInhabitable(cell)}
                                smartHintData={smartHintData}
                                selectedMainNumber={selectedCellMainValue}
                                showSmartHint={showSmartHint}
                            />
                        </View>
                    )
                })}
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
            [thickNessStyleField]: INNER_THICK_BORDER_WIDTH,
        }

        return (
            <View style={[Styles.gridBorderContainer, orientationBasedStyles]} pointerEvents={'none'}>
                {bordersLooper.map(borderNum => {
                    const boldBorder = borderNum === 3 || borderNum === 6
                    const borderViewStyle = boldBorder ? thickBorderStyle : normalBorderStyle
                    return <View key={`${orientation}_${borderNum}`} style={borderViewStyle} />
                })}
            </View>
        )
    }

    const getBoard = () => {
        let keyCounter = 0
        return (
            <View style={[Styles.board, showSmartHint ? { zIndex: 1 } : null]}>
                {looper.map(row => renderRow(row, `${keyCounter++}`))}
                {getGrid('horizontal')}
                {getGrid('vertical')}
            </View>
        )
    }

    return getBoard()
}

export const Board = React.memo(Board_)
