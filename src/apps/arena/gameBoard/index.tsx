import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

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
import { getCellBlockHouseInfo, getCellColHouseInfo, getCellHouseForHouseType, getCellRowHouseInfo, getHouseCells } from '@domain/board/utils/housesAndCells'
import { HOUSE_TYPE } from '@domain/board/board.constants'
import { Board as BoardDomain } from '@domain/board/board'
import { areSameCells, filterEmptyCells, filterHouseCells, getCellAllHousesCells, getCellsSharingHousesWithCells, isCellExists } from '../utils/util'
import { hexToRGBA } from '@utils/util'
import { emit } from '@utils/GlobalEventBus'
import { EVENTS } from 'src/constants/events'
import { useDependency } from 'src/hooks/useDependency'
import { GAME_STATE } from '@application/constants'
import { useAnimateView } from './cell/useAnimateView'
import { fillPuzzleUseCase, inputNumberUseCase } from '@application/usecases/board'
import _cloneDeep from '@lodash/cloneDeep'
import _isEmpty from '@lodash/isEmpty'
import { useAnimationConfigs } from '../hooks/useAnimationConfigs'
import { useThemeValues } from '../hooks/useTheme'
import smartHintColorSystemReader from '../utils/smartHints/colorSystem.reader'

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

const getSleepPromise = (time) => {
    return new Promise(r => {
        setTimeout(r, time)
    })
}

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

    // const [cellsAnimationConfigs, setCellsAnimationConfigs] = useState({})

    const [localCellsHighlightData, setLocalCellsHighlightData] = useState({})
    const theme = useThemeValues()
    const smartHintsColorSystem = _get(theme, 'colors.smartHints')

    const dependencies = useDependency()

    const { gameStateRepository } = dependencies

    const { cellsAnimationConfigs, inhabitableCells, greenTickCells } = useAnimationConfigs()

    const [boardAnimConfig, setBoardAnimConfig] = useState({})

    const { bgColorInterpolation } = useAnimateView(boardAnimConfig)

    // useEffect(() => {
    //     const timerId = setTimeout(async () => {

    //         onCellClick({ row: 2, col: 2 })

    //         await getSleepPromise(1000)

    //         gameStateRepository.setGameState(GAME_STATE.ACTIVE)
    //         const NS_CELL = { row: 2, col: 2 }
    //         const SelectedCellBgColor = 'rgb(255, 245, 187)'

    //         const _animationConfig = {}
    //         const p = new Promise((r) => {
    //             const animationConfig = {
    //                 'mainNumber': {
    //                     'bgColor': {
    //                         config: { toValue: 1, duration: 200, useNativeDriver: false, },
    //                         loopConfig: { iterations: 3 },
    //                         output: ['rgba(244, 243, 238, 0)', '#acaaaf']
    //                     },
    //                 }
    //             }
    //             _set(_animationConfig, [NS_CELL.row, NS_CELL.col], animationConfig)
    //             setCellsAnimationConfigs((prevConfig) => {
    //                 const newConfig = { ..._animationConfig }
    //                 return newConfig
    //             })
    //             setTimeout(r, 1150)
    //         }).then(() => {
    //             const animationConfig = {
    //                 'mainNumber': {
    //                     'bgColor': {
    //                         config: { toValue: 1, duration: 0, useNativeDriver: false, },
    //                         output: ['#acaaaf', SelectedCellBgColor]
    //                     },
    //                 }
    //             }
    //             _set(_animationConfig, [NS_CELL.row, NS_CELL.col], animationConfig)
    //             setCellsAnimationConfigs((prevConfig) => {
    //                 const newConfig = { ..._animationConfig }
    //                 return newConfig
    //             })
    //             return getSleepPromise(1000)
    //         }).then(() => {
    //             // highlight row house cells
    //             const rowCells = getHouseCells(getCellRowHouseInfo(NS_CELL))
    //                 .filter((houseCell) => !areSameCells(NS_CELL, houseCell))
    //             rowCells.forEach(cell => {
    //                 const animationConfig = {
    //                     'mainNumber': {
    //                         'bgColor': {
    //                             config: { toValue: 1, duration: 200, useNativeDriver: false, },
    //                             loopConfig: { iterations: 3 },
    //                             output: ['rgba(244, 243, 238, 0)', '#acaaaf']
    //                         },
    //                     }
    //                 }
    //                 _set(_animationConfig, [cell.row, cell.col], animationConfig)
    //             });
    //             setCellsAnimationConfigs((prevConfig) => {
    //                 const newConfig = { ..._animationConfig }
    //                 return newConfig
    //             })
    //             return getSleepPromise(2000)
    //         }).then(() => {
    //             // highlight column house cells
    //             const rowCells = getHouseCells(getCellColHouseInfo(NS_CELL))
    //                 .filter((houseCell) => !areSameCells(NS_CELL, houseCell))
    //             rowCells.forEach(cell => {
    //                 const animationConfig = {
    //                     'mainNumber': {
    //                         'bgColor': {
    //                             config: { toValue: 1, duration: 200, useNativeDriver: false, },
    //                             loopConfig: { iterations: 3 },
    //                             output: ['rgba(244, 243, 238, 0)', '#acaaaf']
    //                         },
    //                     }
    //                 }
    //                 _set(_animationConfig, [cell.row, cell.col], animationConfig)
    //             });
    //             setCellsAnimationConfigs((prevConfig) => {
    //                 const newConfig = { ..._animationConfig }
    //                 return newConfig
    //             })
    //             return getSleepPromise(2000)
    //         }).then(() => {
    //             // highlight block house cells
    //             const rowCells = getHouseCells(getCellBlockHouseInfo(NS_CELL))
    //                 .filter((houseCell) => !areSameCells(NS_CELL, houseCell))
    //             rowCells.forEach(cell => {
    //                 const animationConfig = {
    //                     'mainNumber': {
    //                         'bgColor': {
    //                             config: { toValue: 1, duration: 200, useNativeDriver: false, },
    //                             loopConfig: { iterations: 3 },
    //                             output: ['rgba(244, 243, 238, 0)', '#acaaaf']
    //                         },
    //                     }
    //                 }
    //                 _set(_animationConfig, [cell.row, cell.col], animationConfig)
    //             });
    //             setCellsAnimationConfigs((prevConfig) => {
    //                 const newConfig = { ..._animationConfig }
    //                 return newConfig
    //             })
    //             return getSleepPromise(2000)
    //         }).then(async () => {
    //             const hostCells = [
    //                 { row: 0, col: 1 },
    //                 { row: 2, col: 4 },
    //                 { row: 2, col: 3 },
    //                 { row: 3, col: 2 },
    //                 { row: 2, col: 6 },
    //                 { row: 2, col: 1 },
    //                 { row: 5, col: 2 },
    //                 { row: 2, col: 7 },
    //             ]

    //             for (let i = 0; i < hostCells.length; i++) {
    //                 const cell = hostCells[i]
    //                 const animationConfig = {
    //                     'mainNumber': {
    //                         'fontSize': {
    //                             config: { toValue: 1.5, duration: 300, useNativeDriver: true }
    //                         },
    //                         'textColor': {
    //                             config: { toValue: 1, duration: 300, useNativeDriver: false, },
    //                             output: ['rgb(12, 25, 22)', '#2653d3']
    //                         }
    //                     }
    //                 }
    //                 _set(_animationConfig, [cell.row, cell.col], animationConfig)
    //                 setCellsAnimationConfigs((prevConfig) => {
    //                     const newConfig = { ..._animationConfig }
    //                     return newConfig
    //                 })
    //                 await getSleepPromise(300)
    //                 const newAnimationConfig = {
    //                     mainNumber: {
    //                         ...animationConfig.mainNumber,
    //                         'fontSize': {
    //                             config: { duration: 300 },
    //                             resetToPrevious: true
    //                         },
    //                     },
    //                 }
    //                 _set(_animationConfig, [cell.row, cell.col], newAnimationConfig)
    //                 setCellsAnimationConfigs((prevConfig) => {
    //                     const newConfig = { ..._animationConfig }
    //                     return newConfig
    //                 })
    //                 await getSleepPromise(1000)
    //             }
    //             await getSleepPromise(2000)
    //         }).then(async () => {
    //             setCellsAnimationConfigs({})
    //             await getSleepPromise(1000)
    //             inputNumberUseCase(5, dependencies)
    //         })
    //     }, 5000)

    //     return () => {
    //         clearTimeout(timerId)
    //     }
    // }, [gameStateRepository, dependencies])

    useEffect(() => {
        gameStateRepository.setGameState(GAME_STATE.ACTIVE)

        // const timerId = setTimeout(async () => {

        //     const exampleCells = [
        //         { row: 0, col: 1 },
        //         { row: 0, col: 5 },
        //         { row: 2, col: 5 },
        //         { row: 2, col: 8 },
        //         // { row: 6, col: 4 },
        //     ]

        //     for (let i = 0; i < exampleCells.length; i++) {
        //         const TARGET_CELL = exampleCells[i]
        //         // onCellClick(TARGET_CELL)
        //         const SelectedCellBgColor = 'rgb(255, 245, 187)'
        //         await getSleepPromise(1000)

        //         const iterationCount = i

        //         gameStateRepository.setGameState(GAME_STATE.ACTIVE)
        //         console.log('@@@@@ iteration')
        //         const _animationConfig = {}
        //         const p = await new Promise((r) => {
        //             const animationConfig = {
        //                 'mainNumber': {
        //                     'bgColor': {
        //                         config: { toValue: 1, duration: 6000 },
        //                         output: [SelectedCellBgColor, SelectedCellBgColor]
        //                     },
        //                     'fontSize': {
        //                         config: { toValue: 1.5, duration: 6000 }
        //                     }
        //                 }
        //             }
        //             _set(_animationConfig, [TARGET_CELL.row, TARGET_CELL.col], animationConfig)
        //             setCellsAnimationConfigs((prevConfig) => {
        //                 const newConfig = { ..._animationConfig }
        //                 return newConfig
        //             })
        //             setTimeout(r, 3000)
        //         }).then(async () => {
        //             // inputNumberUseCase(7, dependencies)
        //             // await getSleepPromise(3000)
        //             const cells = [
        //                 { row: 1, col: 2 },
        //                 { row: 4, col: 2 },
        //                 { row: 4, col: 4 },
        //                 { row: 5, col: 8 },
        //             ]

        //             for (let i = 0; i < cells.length; i++) {
        //                 const TARGET_CELL = cells[i]
        //                 const animationConfig = {
        //                     'mainNumber': {
        //                         'bgColor': {
        //                             config: { toValue: 1, duration: 3000 },
        //                             output: ['transparent', 'red']
        //                         },
        //                         'fontSize': {
        //                             config: { toValue: iterationCount % 2 === 0 ? 3 : 1, duration: 3000 }
        //                         }
        //                     }
        //                 }
        //                 _set(_animationConfig, [TARGET_CELL.row, TARGET_CELL.col], animationConfig)
        //             }
        //             setCellsAnimationConfigs((prevConfig) => {
        //                 // const newConfig = { ..._animationConfig }
        //                 const newConfig = _cloneDeep(_animationConfig)
        //                 return newConfig
        //             })
        //         })
        //     }
        // }, 5000)

        // return () => {
        //     clearTimeout(timerId)
        // }
    }, [gameStateRepository, dependencies])

    const handleCellClick = useCallback((cell) => {
        onCellClick(cell)
    }, [cellsAnimationConfigs, onCellClick])

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

    // const getInhabitableCellProps = (cell: Cell) => ({
    //     displayCrossIcon: _get(cellsHighlightData, [cell.row, cell.col, 'inhabitable'], false),
    //     crossIconColor: _get(cellsHighlightData, [cell.row, cell.col, 'crossIconColor'], ''),
    // })

    const getInhabitableCellProps = (cell: Cell) => ({
        displayCrossIcon: isCellExists(cell, inhabitableCells),
        crossIconColor: smartHintColorSystemReader.inhabitableCellCrossColor(smartHintsColorSystem)
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
                                onCellClick={handleCellClick}
                                {...getInhabitableCellProps(cell)}
                                showCellContent={showCellContent}
                                notesRefs={notesRefs[row][col]}
                                getNoteStyles={getNoteStyles}
                                cellAnimationsConfig={cellAnimationsConfig}
                                animateNumberInsertion={animateNumberInsertion}
                                displayTickIcon={
                                    isCellExists({ row, col }, greenTickCells)
                                }
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
            withoutLineHeight
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
        <Animated.View
            ref={boardRef}
            style={[
                styles.board,
                boardContainerStyles,
                // borderWidthAnim && { borderWidth: borderWidthAnim },
                // borderColorInterpolation && { borderColor: borderColorInterpolation }
                bgColorInterpolation && { backgroundColor: bgColorInterpolation }
            ]}
            collapsable={false}
        >
            {looper.map((row, index) => renderRow(row, `${index}`))}
            {renderBordersGrid(BOARD_GRID_BORDERS_DIRECTION.HORIZONTAL)}
            {renderBordersGrid(BOARD_GRID_BORDERS_DIRECTION.VERTICAL)}
            {showHintsSVGView && renderHintSvgView()}
        </Animated.View>
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
