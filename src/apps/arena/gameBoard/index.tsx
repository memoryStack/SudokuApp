import React, {
    useMemo, useRef,
} from 'react'

import { View } from 'react-native'

import _get from '@lodash/get'
import _set from '@lodash/set'
import _noop from '@lodash/noop'
import _isEmpty from '@lodash/isEmpty'

import { GAME_STATE } from '@resources/constants'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'

import { CellsFocusData, Chain } from '../utils/smartHints/types'
import {
    areSameCells,
    areCommonHouseCells,
} from '../utils/util'
import { isCellFocusedInSmartHint } from '../utils/smartHints/util'
import { cellHasTryOutInput } from '../smartHintHC/helpers'
import {
    BOARD_AXES_VALUES,
    BOARD_GRID_BORDERS_DIRECTION,
    BoardGridBorderDirectionValue,
    STATIC_BOARD_ELEMENTS_DIMENSIONS,
} from '../constants'

import { getStyles } from './gameBoard.styles'
import { Cell } from './cell'

import HintsSvgDrawing from '../hintsSvgDrawing'
import { HINTS_IDS } from '../utils/smartHints/constants'
import { MainNumbersRecord } from '../RecordUtilities/boardMainNumbers'
import { BoardIterators } from '../utils/classes/boardIterators'

const looper: number[] = []
const bordersLooper: number[] = []

for (let i = 0; i < 9; i++) { looper.push(i) }

// 8 borders will be drawn
for (let i = 0; i < 8; i++) { bordersLooper.push(i) }

type NotesRefs = Array<Array<Array<React.RefObject<unknown>>>>

interface Props {
    gameState: GAME_STATE
    mainNumbers: MainNumbers
    notes: Notes
    selectedCell: Cell
    onCellClick: () => void // TODO: how/where to manage types for these prop drilled functions
    isHintTryOut: boolean
    showSmartHint: boolean
    cellsHighlightData: CellsFocusData
    axisTextStyles: object
    svgProps: Chain
    isCustomPuzleScreen: boolean
}

const Board_: React.FC<Props> = ({
    // gameState = 'skl', // why assigning this value doesn't give error as this is not one of values given to GameState ??
    gameState = GAME_STATE.INACTIVE,
    mainNumbers = [],
    notes = [],
    selectedCell = {} as Cell, // why is this type any if type assertion is not used ??
    onCellClick = _noop, // why is this type any ??
    isHintTryOut = false,
    showSmartHint = false,
    cellsHighlightData = {},
    axisTextStyles = {},
    svgProps = [],
    isCustomPuzleScreen = false,
}) => {
    const styles = useStyles(getStyles)

    const selectedCellMainValue = MainNumbersRecord.getCellMainValue(mainNumbers, selectedCell) || 0

    const sameValueAsSelectedBox = (cell: Cell) => selectedCellMainValue && MainNumbersRecord.isCellFilledWithNumber(mainNumbers, selectedCellMainValue, cell)

    const boardRef = useRef(null)

    const notesRefs = useMemo(() => {
        const result: NotesRefs = []
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

    const getCustomPuzzleMainNumFontColor = (cell: Cell) => {
        const isWronglyPlaced = (mainNumbers as CustomPuzzleMainNumbers)[cell.row][cell.col].wronglyPlaced
        if (isWronglyPlaced) return styles.customPuzzleWronglyFilledNumColor
        return styles.clueNumColor
    }

    const getMainNumFontColor = (cell: Cell) => {
        if (!MainNumbersRecord.isCellFilled(mainNumbers, cell)) return null
        if (isCustomPuzleScreen) return getCustomPuzzleMainNumFontColor(cell)
        if (isHintTryOut && cellHasTryOutInput(cell)) return styles.tryOutInputColor
        if (showSmartHint) return styles.clueNumColor
        if (!MainNumbersRecord.isCellFilledCorrectly(mainNumbers, cell)) return styles.wronglyFilledNumColor
        if (!MainNumbersRecord.isClueCell(mainNumbers, cell)) return styles.userFilledNumColor
        return styles.clueNumColor
    }

    const getSmartHintActiveBgColor = (cell: Cell) => {
        if (isHintTryOut && areSameCells(cell, selectedCell) && isCellFocusedInSmartHint(cell)) { return styles.selectedCellBGColor }
        return _get(cellsHighlightData, [cell.row, cell.col, 'bgColor'], styles.smartHintOutOfFocusBGColor)
    }

    const shouldShowCellContent = () => [GAME_STATE.ACTIVE, GAME_STATE.DISPLAY_HINT, GAME_STATE.OVER_SOLVED, GAME_STATE.OVER_UNSOLVED].includes(
        gameState,
    )

    const hasSameValueInSameHouseAsSelectedCell = (cell: Cell) => areCommonHouseCells(cell, selectedCell) && sameValueAsSelectedBox(cell)

    const getCustomPuzzleBoardCellBgColor = (cell: Cell) => {
        if (areSameCells(cell, selectedCell)) return styles.selectedCellBGColor
        if (hasSameValueInSameHouseAsSelectedCell(cell)) { return styles.sameHouseSameValueBGColor }

        return null
    }

    const getActiveGameBoardCellBgCell = (cell: Cell) => {
        if (MainNumbersRecord.isCellFilled(mainNumbers, cell) && !MainNumbersRecord.isCellFilledCorrectly(mainNumbers, cell)) {
            return styles.sameHouseSameValueBGColor
        }
        if (areSameCells(cell, selectedCell)) return styles.selectedCellBGColor
        if (areCommonHouseCells(cell, selectedCell)) return styles.sameHouseCellBGColor
        if (sameValueAsSelectedBox(cell)) return styles.diffHouseSameValueBGColor
        return styles.defaultCellBGColor
    }

    const getCellBackgroundColor = (cell: Cell) => {
        if (!shouldShowCellContent()) return null
        if (showSmartHint) return getSmartHintActiveBgColor(cell)
        if (isCustomPuzleScreen) return getCustomPuzzleBoardCellBgColor(cell)
        return getActiveGameBoardCellBgCell(cell)
    }

    const getInhabitableCellProps = (cell: Cell) => ({
        displayCrossIcon: _get(cellsHighlightData, [cell.row, cell.col, 'inhabitable'], false),
        crossIconColor: _get(cellsHighlightData, [cell.row, cell.col, 'crossIconColor'], ''),
    })

    // TODO: decide over these partial types for Cell.row and Cell.col
    const renderRow = (row: number, key: string) => {
        const getSpacingDueToBorders = (rowOrColNum: number) => {
            if (rowOrColNum === 0) return 0
            if (rowOrColNum === 3 || rowOrColNum === 6) return STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH
            return STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH
        }

        const rowAdditionalStyles = { marginTop: getSpacingDueToBorders(row) }
        return (
            <View style={[styles.rowStyle, rowAdditionalStyles]} key={key}>
                {looper.map((col, index) => {
                    const cell = { row, col }
                    const cellAdditionalStyles = { marginLeft: getSpacingDueToBorders(col) }

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

    const renderBordersGrid = (orientation: BoardGridBorderDirectionValue) => {
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
                    const boldBorder = borderNum === 2 || borderNum === 5
                    const borderViewStyle = boldBorder ? thickBorderStyle : normalBorderStyle
                    const borderColor = styles.lightGridBorder

                    return <View key={`${orientation}_${borderNum}`} style={[borderViewStyle, borderColor]} />
                })}
            </View>
        )
    }

    const renderAxisText = (label: string) => (
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
            {!_isEmpty(cellsHighlightData) && renderHintSvgView()}
        </View>
    )

    return (
        <>
            {xAxis}
            <View style={styles.boardAndYAxisContainer}>
                {yAxis}
                {renderBoard()}
            </View>
        </>
    )
}

export const Board = React.memo(Board_)
