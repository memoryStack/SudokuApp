import React, { useEffect, useMemo, useRef, useState } from 'react'

import { View, StyleProp, ViewStyle, Animated } from 'react-native'

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

type Animation = {
    animatedValue: number,
    config: {
        toValue: number,
        duration: number,
        useNativeDriver?: boolean
    },
    loopIteration?: number
}

// will be re-used to reset the animation
type CellPropertiesVsAnimation = {
    [key: string]: Animation
}

// when this changes then reset/stop all the changed animations
// first and then start the changing animations
type AnimationsComposition = {
    currentAnimation: 'cell property',
    subAnimations: AnimationsComposition,
    composeType: string,
    loopIteration: number, // to know if it's loop or not
}

type CellAnimation = {
    currentAnimation: Animation,
    subAnimations: CellAnimation,
    composeType: string,
    loopIteration: number,
}

// contract for animations
const animations = {
    currentAnimation: {
        animatedValue: '', // animated value,
        config: {
            toValue: '',
            duration: '',
            useNativeDriver: true
        },
        loopIteration: '',
    },
    subAnimations: {
        // it will have same config as above
    },
    composeType: ['parallel', 'sequence'], // one of these
    loopIteration: '',
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
    showAxes = true
}) => {
    const styles = useStyles(getStyles)

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

    const [animationsConfig, setAnimationsConfig] = useState({})

    useEffect(() => {
        setAnimationsConfig({
            // 'fontSize': {
            //     config: { toValue: 1.5, duration: 2000, useNativeDriver: true }
            // }
        })

        setTimeout(() => {
            setAnimationsConfig({
                'borderWidth': {
                    config: { toValue: 3, duration: 1000, useNativeDriver: false },
                }
            })
        }, 1000)

        setTimeout(() => {
            setAnimationsConfig({
                'borderColor': {
                    config: { toValue: 1, duration: 2000, useNativeDriver: false, },
                    output: ['#000000', '#ff0000']
                }
            })
        }, 1000)

        // setTimeout(() => {
        //     setAnimationsConfig({
        //         'fontSize': {
        //             config: { duration: 2000 },
        //             stop: true
        //         }
        //     })
        // }, 1500)

        // setTimeout(() => {
        //     setAnimationsConfig({
        //         'fontSize': {
        //             config: { duration: 2000 },
        //             resetToPrevious: true
        //         }
        //     })
        // }, 6000)

        // setTimeout(() => {
        //     setAnimationsConfig({
        //         'textColor': {
        //             config: { toValue: 1, duration: 2000, useNativeDriver: false, },
        //             output: ['#000000', '#ff0000']
        //         }
        //     })
        // }, 3000)
    }, [])

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

                    const cellAnimationsConfig = index === 3 && MainNumbersRecord.getCellMainValue(mainNumbers, cell)
                        ? animationsConfig : DFF

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
