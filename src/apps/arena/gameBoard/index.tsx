import React, { useEffect, useMemo, useRef, useState } from 'react'

import { View, StyleProp, ViewStyle } from 'react-native'

import _get from '@lodash/get'
import _set from '@lodash/set'
import _noop from '@lodash/noop'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'

import { CellsFocusData, Chain } from '../utils/smartHints/types'

import {
    BOARD_AXES_VALUES,
    BOARD_GRID_BORDERS_DIRECTION,
    BoardGridBorderDirectionValue,
    STATIC_BOARD_ELEMENTS_DIMENSIONS,
} from '../constants'

import HintsSvgDrawing from '../hintsSvgDrawing'
import { HINTS_IDS } from '../utils/smartHints/constants'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { BoardIterators } from '@domain/board/utils/boardIterators'

import { getStyles } from './gameBoard.styles'
import { Cell } from './cell'

const looper: number[] = []
const bordersLooper: number[] = []

for (let i = 0; i < 9; i++) { looper.push(i) }

// 8 borders will be drawn
for (let i = 0; i < 8; i++) { bordersLooper.push(i) }

type NotesRefs = Array<Array<Array<React.RefObject<unknown>>>>

type CellBGColorStyle = {
    backgroundColor: string
}

type FontColor = {
    color: string
}

interface Props {
    mainNumbers: MainNumbers
    notes: Notes
    onCellClick?: () => void
    cellsHighlightData?: CellsFocusData
    axisTextStyles?: StyleProp<ViewStyle>
    boardContainerStyles?: StyleProp<ViewStyle>
    svgProps: Chain
    showCellContent: boolean
    showHintsSVGView: boolean
    getCellBGColor?: () => CellBGColorStyle | null
    getCellMainNumberFontColor?: () => FontColor | null
    getNoteStyles?: (note: NoteValue, cell: Cell) => StyleProp<ViewStyle> | null // this signature is wrong, first argument is Note, not NoteValue
    hideSVGDrawingsMarkersEnd?: boolean
    showAxes?: boolean
    animateNumberInsertion?: boolean
}

const DFF = {}

const Board_: React.FC<Props> = ({
    mainNumbers = [],
    notes = [],
    onCellClick = _noop,
    cellsHighlightData = {},
    axisTextStyles = {},
    svgProps = [],
    showCellContent = true,
    showHintsSVGView = false,
    getCellBGColor = _noop,
    getCellMainNumberFontColor = _noop,
    boardContainerStyles = null,
    getNoteStyles = _noop,
    hideSVGDrawingsMarkersEnd = false,
    showAxes = true,
    animateNumberInsertion = false,
}) => {
    const styles = useStyles(getStyles)

    const boardRef = useRef(null)

    const [cellsAnimationConfigs, setCellsAnimationConfigs] = useState({})

    useEffect(() => {

        const cells = [
            { row: 0, col: 1 },
            { row: 2, col: 4 },
            { row: 2, col: 3 },
            { row: 3, col: 2 },

            { row: 2, col: 6 },
            { row: 2, col: 1 },
            { row: 5, col: 2 },
            { row: 2, col: 7 },
        ]
        const initialDelay = 500
        const animationLength = 1200
        cells.forEach((cell, index) => {
            const animationConfig = {
                'mainNumber': {
                    'fontSize': {
                        config: { toValue: 1.5, duration: 500, useNativeDriver: true },
                        loopConfig: { iterations: 1 },
                    },
                    'textColor': {
                        config: { toValue: 1, duration: 500, useNativeDriver: false, },
                        loopConfig: { iterations: 1 },
                        output: ['#000000', '#2653d3']
                    }
                }
            }

            const animatinDelay = initialDelay + animationLength * (index + 1)

            setTimeout(() => {
                setCellsAnimationConfigs((prevConfig) => {
                    const newConfig = { ...prevConfig }
                    return _set(newConfig, [cell.row, cell.col], animationConfig)
                })
            }, animatinDelay)
        })
    }, [])

    const notesRefs = useMemo(() => {
        const result: NotesRefs = []
        BoardIterators.forBoardEachCell(({ row, col }) => {
            BoardIterators.forCellEachNote((_, noteIdx) => {
                _set(result, [row, col, noteIdx], React.createRef())
            })
        })
        return result
    }, [])

    const renderHintSvgView = () => {
        if (!showHintsSVGView) return null

        return (
            <HintsSvgDrawing
                hint={{ id: HINTS_IDS.REMOTE_PAIRS }}
                boardRef={boardRef}
                notesRefs={notesRefs}
                svgProps={svgProps}
                hideMarkersEnd={hideSVGDrawingsMarkersEnd}
            />
        )
    }

    const getMainNumFontColor = (cell: Cell): FontColor | null => {
        if (!MainNumbersRecord.isCellFilled(mainNumbers, cell)) return null
        if (getCellMainNumberFontColor !== _noop) return getCellMainNumberFontColor(cell)
        return styles.defaultMainNumberColor
    }

    const _getCellBGColor = (cell: Cell): CellBGColorStyle | null => {
        if (getCellBGColor !== _noop) return getCellBGColor(cell)
        return styles.defaultCellBGColor
    }

    const getInhabitableCellProps = (cell: Cell) => ({
        displayCrossIcon: _get(cellsHighlightData, [cell.row, cell.col, 'inhabitable'], false),
        crossIconColor: _get(cellsHighlightData, [cell.row, cell.col, 'crossIconColor'], ''),
    })

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

                    const cellAnimationsConfig = _get(cellsAnimationConfigs, [row, col], {})

                    return (
                        // eslint-disable-next-line react/no-array-index-key
                        <View style={[styles.cellContainer, cellAdditionalStyles]} key={index}>
                            <Cell
                                row={row}
                                col={col}
                                cellBGColor={_getCellBGColor(cell)}
                                mainValueFontColor={getMainNumFontColor(cell)}
                                cellMainValue={MainNumbersRecord.getCellMainValue(mainNumbers, cell)}
                                cellNotes={_get(notes, [row, col])}
                                onCellClick={onCellClick}
                                {...getInhabitableCellProps(cell)}
                                showCellContent={showCellContent}
                                notesRefs={notesRefs[row][col]}
                                getNoteStyles={getNoteStyles}
                                cellAnimationsConfig={cellAnimationsConfig}
                                animateNumberInsertion={animateNumberInsertion}
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
                    const borderColor = boldBorder ? styles.lightGridBorder : styles.thinGridBorder

                    return <View key={`${orientation}_${borderNum}`} style={[borderViewStyle, borderColor]} />
                })}
            </View>
        )
    }

    const renderAxisText = (label: string) => (
        <Text
            key={label}
            style={[styles.axisText, axisTextStyles]}
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
            style={[styles.board, boardContainerStyles]}
            collapsable={false}
        >
            {looper.map((row, index) => renderRow(row, `${index}`))}
            {renderBordersGrid(BOARD_GRID_BORDERS_DIRECTION.HORIZONTAL)}
            {renderBordersGrid(BOARD_GRID_BORDERS_DIRECTION.VERTICAL)}
            {showHintsSVGView && renderHintSvgView()}
        </View>
    )

    return (
        <>
            <View style={styles.boardAndYAxisContainer}>
                {showAxes ? yAxis : null}
                {renderBoard()}
            </View>
            {showAxes ? xAxis : null}
        </>
    )
}

export const Board = React.memo(Board_)
