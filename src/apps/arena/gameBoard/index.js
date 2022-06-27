import React, { useMemo } from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux'

import { GAME_STATE, SCREEN_NAME } from '../../../resources/constants'
import { consoleLog, sameHouseAsSelected } from '../../../utils/util'
import {
    useBoardElementsDimensions,
    INNER_THICK_BORDER_WIDTH,
    GRID_THIN_BORDERS_WIDTH,
} from '../../../utils/customHooks/boardElementsDimensions'

import { getHintHCInfo } from '../store/selectors/smartHintHC.selectors'

import { getStyles } from './style'
import { Cell } from './cell'
import { areSameCells } from '../utils/util'
import { isCellFocusedInSmartHint } from '../utils/smartHints/util'
import { cellHasTryOutInput } from '../smartHintHC/helpers'
import { BOARD_AXES_VALUES } from '../constants'

const looper = []
const bordersLooper = []
for (let i = 0; i < 10; i++) {
    if (i < 9) looper.push(i) // 9 cells are there in a row
    bordersLooper.push(i) // 10 borders will be drawn
}

const Board_ = ({ screenName, gameState, mainNumbers, notesInfo, selectedCell, onCellClick, isHintTryOut }) => {
    const { show: showSmartHint, hint: { cellsToFocusData: smartHintCellsHighlightInfo = {} } = {} } =
        useSelector(getHintHCInfo)

    const { GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT, CELL_WIDTH } = useBoardElementsDimensions()

    const styles = useMemo(() => {
        return getStyles({ GAME_BOARD_HEIGHT, GAME_BOARD_WIDTH, CELL_WIDTH })
    }, [GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT, CELL_WIDTH])

    const selectedCellMainValue = mainNumbers[selectedCell.row][selectedCell.col].value || 0

    const sameValueAsSelectedBox = cell =>
        selectedCellMainValue && selectedCellMainValue === mainNumbers[cell.row][cell.col].value

    const getCustomPuzzleMainNumFontColor = cell => {
        const isWronglyPlaced = mainNumbers[cell.row][cell.col].wronglyPlaced
        if (isWronglyPlaced) return styles.wronglyFilledNumColor
        // consider any other number as clue
        return styles.clueNumColor
    }

    const getMainNumFontColor = cell => {
        const { row, col } = cell
        if (!mainNumbers[row][col].value) return null
        if (screenName === SCREEN_NAME.CUSTOM_PUZZLE) return getCustomPuzzleMainNumFontColor(cell)

        if (isHintTryOut && cellHasTryOutInput(cell)) return styles.tryOutInputColor

        const isWronglyPlaced = mainNumbers[row][col].value !== mainNumbers[row][col].solutionValue
        if (isWronglyPlaced) return styles.wronglyFilledNumColor
        if (!mainNumbers[row][col].isClue) return styles.userFilledNumColor
        return styles.clueNumColor
    }

    const getSmartHintActiveBgColor = cell => {
        if (isHintTryOut && areSameCells(cell, selectedCell) && isCellFocusedInSmartHint(cell))
            return styles.selectedCellBGColor

        const { row, col } = cell
        return (
            (smartHintCellsHighlightInfo[row] &&
                smartHintCellsHighlightInfo[row][col] &&
                smartHintCellsHighlightInfo[row][col].bgColor) ||
            styles.smartHintOutOfFocusBGColor
        )
    }

    const showCellContent = [
        GAME_STATE.ACTIVE,
        GAME_STATE.DISPLAY_HINT,
        GAME_STATE.OVER.SOLVED,
        GAME_STATE.OVER.UNSOLVED,
    ].includes(gameState)

    // this is going to get complicated, i guess it's better to break it
    const getBoxBackgroundColor = cell => {
        if (showSmartHint) return getSmartHintActiveBgColor(cell)

        if (!showCellContent) return null

        if (areSameCells(cell, selectedCell)) return styles.selectedCellBGColor

        const isSameHouseAsSelected = sameHouseAsSelected(cell, selectedCell)
        const isSameValueAsSelected = sameValueAsSelectedBox(cell)
        if (isSameHouseAsSelected && isSameValueAsSelected) return styles.sameHouseSameValueBGColor
        if (screenName === SCREEN_NAME.CUSTOM_PUZZLE) return null // won't show backgorund color for the below type of cells
        if (isSameHouseAsSelected) return styles.sameHouseCellBGColor
        if (!isSameHouseAsSelected && isSameValueAsSelected) return styles.diffHouseSameValueBGColor
        return styles.defaultCellBGColor
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

        const rowAdditionalStyles = {
            marginTop: row === 3 || row === 6 ? INNER_THICK_BORDER_WIDTH : GRID_THIN_BORDERS_WIDTH,
            marginBottom: row === 8 ? GRID_THIN_BORDERS_WIDTH : 0,
        }

        return (
            <View style={[styles.rowStyle, rowAdditionalStyles]} key={key}>
                {looper.map(col => {
                    const smartHintData = smartHintCellsHighlightInfo[row] && smartHintCellsHighlightInfo[row][col]
                    const cell = { row, col }

                    const cellAdditionalStyles = {
                        marginLeft: col === 3 || col === 6 ? INNER_THICK_BORDER_WIDTH : GRID_THIN_BORDERS_WIDTH,
                        marginRight: col === 8 ? GRID_THIN_BORDERS_WIDTH : 0,
                    }

                    return (
                        <View style={{ flexDirection: 'row' }}>
                            <View
                                style={[styles.cellContainer, cellAdditionalStyles]}
                                key={`${rowElementsKeyCounter++}`}
                            >
                                <Cell
                                    row={row}
                                    col={col}
                                    cellBGColor={getBoxBackgroundColor(cell)}
                                    mainValueFontColor={getMainNumFontColor(cell)}
                                    cellMainValue={mainNumbers[row][col].value}
                                    cellNotes={notesInfo[row][col]}
                                    onCellClick={onCellClick}
                                    displayCrossIcon={shouldMarkCellAsInhabitable(cell)}
                                    smartHintData={smartHintData}
                                    selectedMainNumber={selectedCellMainValue}
                                    showSmartHint={showSmartHint}
                                    showCellContent={showCellContent}
                                />
                            </View>
                        </View>
                    )
                })}
            </View>
        )
    }

    const getGrid = orientation => {
        const isVertical = orientation === 'vertical'
        const orientationBasedStyles = { flexDirection: isVertical ? 'row' : 'column' }
        const normalBorderStyle = isVertical ? styles.verticalBars : styles.horizontalBars
        const thickNessStyleField = isVertical ? 'width' : 'height'
        const thickBorderStyle = {
            ...normalBorderStyle,
            [thickNessStyleField]: INNER_THICK_BORDER_WIDTH,
        }

        return (
            <View style={[styles.gridBorderContainer, orientationBasedStyles]} pointerEvents={'none'}>
                {bordersLooper.map(borderNum => {
                    const boldBorder = borderNum === 3 || borderNum === 6
                    const borderViewStyle = boldBorder ? thickBorderStyle : normalBorderStyle
                    return <View key={`${orientation}_${borderNum}`} style={borderViewStyle} />
                })}
            </View>
        )
    }

    const renderAxisText = label => {
        return <Text style={showSmartHint ? styles.smartHintAxisText : styles.axisText}>{label}</Text>
    }

    const yAxis = useMemo(() => {
        const yAxisTexts = BOARD_AXES_VALUES.Y_AXIS
        return (
            <View style={styles.yAxis}>
                {yAxisTexts.map(label => {
                    return renderAxisText(label)
                })}
            </View>
        )
    }, [showSmartHint])

    const xAxis = useMemo(() => {
        const xAxisTexts = BOARD_AXES_VALUES.X_AXIS
        return (
            <View style={styles.xAxis}>
                {xAxisTexts.map(label => {
                    return renderAxisText(label)
                })}
            </View>
        )
    }, [showSmartHint])

    const renderBoard = () => {
        let keyCounter = 0
        return (
            <View style={[styles.board, showSmartHint ? { zIndex: 1 } : null]}>
                {looper.map(row => renderRow(row, `${keyCounter++}`))}
                {getGrid('horizontal')}
                {getGrid('vertical')}
            </View>
        )
    }

    return (
        <>
            {xAxis}
            <View style={{ flexDirection: 'row' }}>
                {yAxis}
                {renderBoard()}
            </View>
        </>
    )
}

export const Board = React.memo(Board_)
