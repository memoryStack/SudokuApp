import React, {
    useMemo, useRef,
} from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import _get from '@lodash/get'
import _set from '@lodash/set'
import _noop from '@lodash/noop'
import _isEmpty from '@lodash/isEmpty'

import { GAME_STATE } from '@resources/constants'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'

import { useSelector } from 'react-redux'
import {
    areSameCells,
    areCommonHouseCells,
} from '../utils/util'
import { isCellFocusedInSmartHint } from '../utils/smartHints/util'
import { cellHasTryOutInput } from '../smartHintHC/helpers'
import {
    BOARD_AXES_VALUES,
    BOARD_GRID_BORDERS_DIRECTION,
    CELLS_IN_HOUSE,
    STATIC_BOARD_ELEMENTS_DIMENSIONS,
} from '../constants'

import { getStyles } from './gameBoard.styles'
import { Cell } from './cell'

import HintsSvgDrawing from '../hintsSvgDrawing'
import { HINTS_IDS } from '../utils/smartHints/constants'
import { MainNumbersRecord } from '../RecordUtilities/boardMainNumbers'
import { BoardIterators } from '../utils/classes/boardIterators'
import { getTryOutMainNumbers } from '../store/selectors/smartHintHC.selectors'

const looper = []
const bordersLooper = []
for (let i = 0; i < 10; i++) {
    if (i < CELLS_IN_HOUSE) looper.push(i)
    bordersLooper.push(i) // 10 borders will be drawn
}

const Board_ = ({
    gameState,
    mainNumbers,
    notes,
    selectedCell,
    onCellClick,
    isHintTryOut,
    showSmartHint,
    cellsHighlightData,
    axisTextStyles,
    svgProps,
    isCustomPuzleScreen,
}) => {
    const styles = useStyles(getStyles)

    const tryOutMainNumbers = useSelector(getTryOutMainNumbers)

    const selectedCellMainValue = MainNumbersRecord.getCellMainValue(mainNumbers, selectedCell) || 0

    const sameValueAsSelectedBox = cell => selectedCellMainValue && MainNumbersRecord.isCellFilledWithNumber(mainNumbers, selectedCellMainValue, cell)

    const boardRef = useRef(null)

    const notesRefs = useMemo(() => {
        const result = []
        BoardIterators.forBoardEachCell(({ row, col }) => {
            BoardIterators.forCellEachNote((_, noteIdx) => {
                _set(result, [row, col, noteIdx], React.createRef())
            })
        })
        return result
    }, [])

    // TODO: control it's visibility via hints props
    // hints will mark if svg is needed or not for a particulat hint
    const renderHintSvgView = () => (
        <HintsSvgDrawing
            hint={{ id: HINTS_IDS.REMOTE_PAIRS }}
            boardRef={boardRef}
            notesRefs={notesRefs}
            svgProps={svgProps}
        />
    )

    const getCustomPuzzleMainNumFontColor = cell => {
        const isWronglyPlaced = mainNumbers[cell.row][cell.col].wronglyPlaced
        if (isWronglyPlaced) return styles.wronglyFilledNumColor
        // consider any other number as clue
        return styles.clueNumColor
    }

    const getMainNumFontColor = cell => {
        if (!MainNumbersRecord.isCellFilled(mainNumbers, cell)) return null
        if (isCustomPuzleScreen) return getCustomPuzzleMainNumFontColor(cell)
        if (isHintTryOut && cellHasTryOutInput(cell, mainNumbers, tryOutMainNumbers)) return styles.tryOutInputColor
        if (showSmartHint) return styles.clueNumColor
        if (!MainNumbersRecord.isCellFilledCorrectly(mainNumbers, cell)) return styles.wronglyFilledNumColor
        if (!MainNumbersRecord.isClueCell(mainNumbers, cell)) return styles.userFilledNumColor
        return styles.clueNumColor
    }

    const getSmartHintActiveBgColor = cell => {
        if (isHintTryOut && areSameCells(cell, selectedCell) && isCellFocusedInSmartHint(cell)) { return styles.selectedCellBGColor }
        return _get(cellsHighlightData, [cell.row, cell.col, 'bgColor'], styles.smartHintOutOfFocusBGColor)
    }

    const shouldShowCellContent = () => [GAME_STATE.ACTIVE, GAME_STATE.DISPLAY_HINT, GAME_STATE.OVER.SOLVED, GAME_STATE.OVER.UNSOLVED].includes(
        gameState,
    )

    const hasSameValueInSameHouseAsSelectedCell = cell => areCommonHouseCells(cell, selectedCell) && sameValueAsSelectedBox(cell)

    const getCustomPuzzleBoardCellBgColor = cell => {
        if (areSameCells(cell, selectedCell)) return styles.selectedCellBGColor
        if (hasSameValueInSameHouseAsSelectedCell(cell)) return styles.sameHouseSameValueBGColor
        return null
    }

    const getActiveGameBoardCellBgCell = cell => {
        if (areSameCells(cell, selectedCell)) return styles.selectedCellBGColor
        if (hasSameValueInSameHouseAsSelectedCell(cell)) return styles.sameHouseSameValueBGColor

        if (areCommonHouseCells(cell, selectedCell)) return styles.sameHouseCellBGColor
        if (sameValueAsSelectedBox(cell)) return styles.diffHouseSameValueBGColor
        return styles.defaultCellBGColor
    }

    const getCellBackgroundColor = cell => {
        if (!shouldShowCellContent()) return null
        if (showSmartHint) return getSmartHintActiveBgColor(cell)
        if (isCustomPuzleScreen) return getCustomPuzzleBoardCellBgColor(cell)
        return getActiveGameBoardCellBgCell(cell)
    }

    const getInhabitableCellProps = cell => ({
        displayCrossIcon: _get(cellsHighlightData, [cell.row, cell.col, 'inhabitable'], false),
        crossIconColor: _get(cellsHighlightData, [cell.row, cell.col, 'crossIconColor'], ''),
    })

    const renderRow = (row, key) => {
        const rowAdditionalStyles = {
            marginTop:
                row === 3 || row === 6
                    ? STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH
                    : STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH,
            marginBottom: row === 8 ? STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH : 0,
        }

        return (
            <View style={[styles.rowStyle, rowAdditionalStyles]} key={key}>
                {looper.map((col, index) => {
                    const cell = { row, col }
                    const cellAdditionalStyles = {
                        marginLeft:
                            col === 3 || col === 6
                                ? STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH
                                : STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH,
                        marginRight: col === 8 ? STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH : 0,
                    }

                    return (
                        // eslint-disable-next-line react/no-array-index-key
                        <View style={[styles.cellContainer, cellAdditionalStyles]} key={index}>
                            <Cell
                                row={row}
                                col={col}
                                cellBGColor={getCellBackgroundColor(cell)}
                                mainValueFontColor={getMainNumFontColor(cell)}
                                cellMainValue={MainNumbersRecord.getCellMainValue(mainNumbers, cell)}
                                cellNotes={_get(notes, [row, col])}
                                onCellClick={onCellClick}
                                {...getInhabitableCellProps(cell)}
                                smartHintData={_get(cellsHighlightData, [row, col])}
                                selectedMainNumber={selectedCellMainValue}
                                showSmartHint={showSmartHint}
                                showCellContent={shouldShowCellContent()}
                                notesRefs={notesRefs[row][col]}
                            />
                        </View>
                    )
                })}
            </View>
        )
    }

    const renderBordersGrid = orientation => {
        const isVertical = orientation === BOARD_GRID_BORDERS_DIRECTION.VERTICAL
        const orientationBasedStyles = { flexDirection: isVertical ? 'row' : 'column' }
        const normalBorderStyle = isVertical ? styles.verticalBars : styles.horizontalBars
        const thickNessStyleField = isVertical ? 'width' : 'height'
        const thickBorderStyle = {
            ...normalBorderStyle,
            [thickNessStyleField]: STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH,
        }

        return (
            <View style={[styles.gridBorderContainer, orientationBasedStyles]} pointerEvents="none">
                {bordersLooper.map(borderNum => {
                    const boldBorder = borderNum === 3 || borderNum === 6
                    const borderViewStyle = boldBorder ? thickBorderStyle : normalBorderStyle
                    return <View key={`${orientation}_${borderNum}`} style={borderViewStyle} />
                })}
            </View>
        )
    }

    const renderAxisText = label => (
        <Text
            key={label}
            style={[showSmartHint ? styles.smartHintAxisText : null, axisTextStyles]}
            type={TEXT_VARIATIONS.BODY_MEDIUM}
        >
            {label}
        </Text>
    )

    const yAxis = (
        <View style={styles.yAxis}>
            {BOARD_AXES_VALUES.Y_AXIS.map(label => renderAxisText(label))}
        </View>
    )

    const xAxis = (
        <View style={styles.xAxis}>
            {BOARD_AXES_VALUES.X_AXIS.map(label => renderAxisText(label))}
        </View>
    )

    const renderBoard = () => (
        <View
            ref={boardRef}
            style={[styles.board, showSmartHint ? { zIndex: 1 } : null]}
            collapsable={false}
        >
            {looper.map((row, index) => renderRow(row, `${index}`))}
            {renderBordersGrid(BOARD_GRID_BORDERS_DIRECTION.HORIZONTAL)}
            {renderBordersGrid(BOARD_GRID_BORDERS_DIRECTION.VERTICAL)}
        </View>
    )

    return (
        <>
            {xAxis}
            <View style={styles.boardAndYAxisContainer}>
                {yAxis}
                {renderBoard()}
            </View>
            {!_isEmpty(cellsHighlightData) && renderHintSvgView()}
        </>
    )
}

export const Board = React.memo(Board_)

Board_.propTypes = {
    mainNumbers: PropTypes.array,
    notes: PropTypes.array,
    gameState: PropTypes.string,
    selectedCell: PropTypes.object,
    onCellClick: PropTypes.func,
    isHintTryOut: PropTypes.bool,
    showSmartHint: PropTypes.bool,
    cellsHighlightData: PropTypes.object,
    axisTextStyles: PropTypes.object,
    svgProps: PropTypes.array, // experimental
    isCustomPuzleScreen: PropTypes.bool,
}

Board_.defaultProps = {
    mainNumbers: [],
    notes: [],
    gameState: GAME_STATE.INACTIVE,
    selectedCell: {},
    onCellClick: _noop,
    isHintTryOut: false,
    showSmartHint: false,
    cellsHighlightData: {},
    axisTextStyles: {},
    svgProps: [],
    isCustomPuzleScreen: false,
}
