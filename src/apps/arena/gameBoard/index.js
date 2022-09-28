import React, { useMemo } from 'react'

import { View, Text } from 'react-native'

import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import _noop from 'lodash/src/utils/noop'
import _get from 'lodash/src/utils/get'

import { GAME_STATE, SCREEN_NAME } from '../../../resources/constants'
import { useBoardElementsDimensions } from '../../../utils/customHooks'

import { getHintHCInfo } from '../store/selectors/smartHintHC.selectors'
import { areSameCells, sameHouseAsSelected } from '../utils/util'
import { isCellFocusedInSmartHint } from '../utils/smartHints/util'
import { cellHasTryOutInput } from '../smartHintHC/helpers'
import { BOARD_AXES_VALUES, STATIC_BOARD_ELEMENTS_DIMENSIONS } from '../constants'

import { getStyles } from './style'
import { Cell } from './cell'

const looper = []
const bordersLooper = []
for (let i = 0; i < 10; i++) {
    if (i < 9) looper.push(i) // 9 cells are there in a row
    bordersLooper.push(i) // 10 borders will be drawn
}

const Board_ = ({ screenName, gameState, mainNumbers, notesInfo, selectedCell, onCellClick, isHintTryOut }) => {
    const { show: showSmartHint, hint: { cellsToFocusData: smartHintCellsHighlightInfo = {} } = {} } =
        useSelector(getHintHCInfo)

    const { BOARD_GRID_WIDTH, BOARD_GRID_HEIGHT, CELL_WIDTH } = useBoardElementsDimensions()

    const styles = useMemo(() => {
        return getStyles({ BOARD_GRID_HEIGHT, BOARD_GRID_WIDTH, CELL_WIDTH })
    }, [BOARD_GRID_WIDTH, BOARD_GRID_HEIGHT, CELL_WIDTH])

    const selectedCellMainValue = mainNumbers[selectedCell.row][selectedCell.col].value || 0

    const sameValueAsSelectedBox = cell =>
        selectedCellMainValue && selectedCellMainValue === mainNumbers[cell.row][cell.col].value

    const getCustomPuzzleMainNumFontColor = cell => {
        const isWronglyPlaced = mainNumbers[cell.row][cell.col].wronglyPlaced
        if (isWronglyPlaced) return styles.wronglyFilledNumColor
        // consider any other number as clue
        return styles.clueNumColor
    }

    const isCustomPuzleScreen = () => {
        return screenName === SCREEN_NAME.CUSTOM_PUZZLE
    }

    const getMainNumFontColor = cell => {
        const { row, col } = cell
        if (!mainNumbers[row][col].value) return null
        if (isCustomPuzleScreen()) return getCustomPuzzleMainNumFontColor(cell)

        if (isHintTryOut && cellHasTryOutInput(cell)) return styles.tryOutInputColor

        if (mainNumbers[row][col].value !== mainNumbers[row][col].solutionValue) return styles.wronglyFilledNumColor
        if (!mainNumbers[row][col].isClue) return styles.userFilledNumColor
        return styles.clueNumColor
    }

    const getSmartHintActiveBgColor = cell => {
        if (isHintTryOut && areSameCells(cell, selectedCell) && isCellFocusedInSmartHint(cell))
            return styles.selectedCellBGColor
        return _get(smartHintCellsHighlightInfo, [cell.row, cell.col, 'bgColor'], styles.smartHintOutOfFocusBGColor)
    }

    const shouldShowCellContent = () => {
        return [GAME_STATE.ACTIVE, GAME_STATE.DISPLAY_HINT, GAME_STATE.OVER.SOLVED, GAME_STATE.OVER.UNSOLVED].includes(
            gameState,
        )
    }

    const hasSameValueInSameHouseAsSelectedCell = cell => {
        return sameHouseAsSelected(cell, selectedCell) && sameValueAsSelectedBox(cell)
    }

    const getCustomPuzzleBoardCellBgColor = cell => {
        if (areSameCells(cell, selectedCell)) return styles.selectedCellBGColor
        if (hasSameValueInSameHouseAsSelectedCell(cell)) return styles.sameHouseSameValueBGColor
        return null
    }

    const getActiveGameBoardCellBgCell = cell => {
        if (areSameCells(cell, selectedCell)) return styles.selectedCellBGColor
        if (hasSameValueInSameHouseAsSelectedCell(cell)) return styles.sameHouseSameValueBGColor

        const isSameHouseAsSelected = sameHouseAsSelected(cell, selectedCell)
        const isSameValueAsSelected = sameValueAsSelectedBox(cell)
        if (isSameHouseAsSelected) return styles.sameHouseCellBGColor
        if (!isSameHouseAsSelected && isSameValueAsSelected) return styles.diffHouseSameValueBGColor
        return styles.defaultCellBGColor
    }

    const getBoxBackgroundColor = cell => {
        if (!shouldShowCellContent()) return null
        if (showSmartHint) return getSmartHintActiveBgColor(cell)
        if (isCustomPuzleScreen()) return getCustomPuzzleBoardCellBgColor(cell)
        return getActiveGameBoardCellBgCell(cell)
    }

    const shouldMarkCellAsInhabitable = cell => {
        if (!showSmartHint) return false
        return _get(smartHintCellsHighlightInfo, [cell.row, cell.col, 'inhabitable'], false)
    }

    const renderRow = (row, key) => {
        const rowAdditionalStyles = {
            marginTop: row === 3 || row === 6 ? STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH : STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH,
            marginBottom: row === 8 ? STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH : 0,
        }

        return (
            <View style={[styles.rowStyle, rowAdditionalStyles]} key={key}>
                {looper.map((col, index) => {
                    const smartHintData = smartHintCellsHighlightInfo[row] && smartHintCellsHighlightInfo[row][col]
                    const cell = { row, col }

                    const cellAdditionalStyles = {
                        marginLeft: col === 3 || col === 6 ? STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH : STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH,
                        marginRight: col === 8 ? STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH : 0,
                    }

                    return (
                        <View style={{ flexDirection: 'row' }}>
                            <View style={[styles.cellContainer, cellAdditionalStyles]} key={`${index}`}>
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
                                    showCellContent={shouldShowCellContent()}
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
            [thickNessStyleField]: STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH,
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
        return (
            <View style={styles.yAxis}>
                {BOARD_AXES_VALUES.Y_AXIS.map(label => {
                    return renderAxisText(label)
                })}
            </View>
        )
    }, [showSmartHint])

    const xAxis = useMemo(() => {
        return (
            <View style={styles.xAxis}>
                {BOARD_AXES_VALUES.X_AXIS.map(label => {
                    return renderAxisText(label)
                })}
            </View>
        )
    }, [showSmartHint])

    const renderBoard = () => {
        return (
            <View style={[styles.board, showSmartHint ? { zIndex: 1 } : null]}>
                {looper.map((row, index) => renderRow(row, `${index}`))}
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

Board_.propTypes = {
    mainNumbers: PropTypes.array,
    notesInfo: PropTypes.array,
    screenName: PropTypes.string,
    gameState: PropTypes.string,
    selectedCell: PropTypes.object,
    onCellClick: PropTypes.func,
    isHintTryOut: PropTypes.bool,
}

Board_.defaultProps = {
    screenName: '',
    gameState: GAME_STATE.INACTIVE,
    selectedCell: {},
    onCellClick: _noop,
    isHintTryOut: false,
}
