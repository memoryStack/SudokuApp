import React, {
    useMemo, useState, useEffect, useRef,
} from 'react'

import { View, Text } from 'react-native'

import PropTypes from 'prop-types'

import {
    Svg, Path, Circle, Defs, Marker,
} from 'react-native-svg'

import _get from 'lodash/src/utils/get'
import _set from 'lodash/src/utils/set'
import _map from 'lodash/src/utils/map'
import _noop from 'lodash/src/utils/noop'
import _isEmpty from 'lodash/src/utils/isEmpty'
import _compact from 'lodash/src/utils/compact'
import _forEach from 'lodash/src/utils/forEach'
import _reduce from 'lodash/src/utils/reduce'

import { GAME_STATE, SCREEN_NAME } from '../../../resources/constants'

import { useBoardElementsDimensions } from '../hooks/useBoardElementsDimensions'
import {
    areSameCells, areCommonHouseCells, forBoardEachCell, forCellEachNote,
} from '../utils/util'
import { isCellFocusedInSmartHint } from '../utils/smartHints/util'
import { cellHasTryOutInput } from '../smartHintHC/helpers'
import {
    BOARD_AXES_VALUES,
    BOARD_GRID_BORDERS_DIRECTION,
    CELLS_IN_HOUSE,
    STATIC_BOARD_ELEMENTS_DIMENSIONS,
} from '../constants'

import { getStyles } from './style'
import { Cell } from './cell'
import { consoleLog, rgba, roundToNearestPixel } from '../../../utils/util'
import { getAngleBetweenLines, getCurveCenters, getPointsOnLineFromEndpoints } from './curvePath.utils'

import HintsSvgDrawing from '../hintsSvgDrawing'
import { HINTS_IDS } from '../utils/smartHints/constants'
import { MARKER_TYPES } from '../hintsSvgDrawing/svgDefs/remotePairs/remotePairs.constants'

const looper = []
const bordersLooper = []
for (let i = 0; i < 10; i++) {
    if (i < CELLS_IN_HOUSE) looper.push(i)
    bordersLooper.push(i) // 10 borders will be drawn
}

const SVG_STROKE_WIDTH = roundToNearestPixel(2) // width 2 is good for chains

const getChainPath = async (notesRefs, boardRef) => {
    const chainTrack = [
        // {
        //     cell: { row: 0, col: 0 },
        //     out: 5,
        // },
        // {
        //     cell: { row: 2, col: 2 },
        //     in: 3,
        //     out: 9,
        // },
        // {
        //     cell: { row: 5, col: 2 },
        //     in: 1,
        //     out: 7,
        // },
        // {
        //     cell: { row: 3, col: 4 },
        //     in: 1,
        //     out: 7,
        // },
        // {
        //     cell: { row: 3, col: 6 },
        //     in: 7,
        //     out: 3,
        // },
        // {
        //     cell: { row: 4, col: 6 },
        //     in: 7,
        //     out: 3,
        // },
        // {
        //     cell: { row: 4, col: 7 },
        //     in: 1,
        //     out: 3,
        // },

        // small bond from right to left
        // {
        //     cell: { row: 0, col: 8 },
        //     out: 1,
        // },
        // {
        //     cell: { row: 0, col: 7 },
        //     in: 1,
        // },

        // small bond from top to bottom
        // {
        //     cell: { row: 2, col: 6 },
        //     out: 3,
        // },
        // {
        //     cell: { row: 3, col: 6 },
        //     in: 3,
        // },

        // long bond
        // {
        //     cell: { row: 3, col: 4 },
        //     out: 2,
        // },
        // {
        //     cell: { row: 5, col: 3 },
        //     in: 7,
        // },

        {
            cell: { row: 2, col: 2 },
            out: 1,
        },
        {
            cell: { row: 2, col: 3 },
            in: 2,
            out: 1,
        },

    ]

    return new Promise(resolve => {
        // TODO: use null check here
        boardRef.current.measure((_x, _y, _boardWidth, _boardHeight, boardPageX, boardPageY) => {
            const promises = []

            // promises for each note in each cell
            for (let i = 0; i < chainTrack.length; i++) {
                const currentSpot = chainTrack[i]

                const { cell, in: currentSpotIn, out: currentSpotOut } = currentSpot
                const notesToMeasure = _compact([currentSpotIn, currentSpotOut])

                // measure each note of the cell
                _forEach(notesToMeasure, note => {
                    const pro = new Promise(resolve => {
                        notesRefs[cell.row][cell.col][note - 1].current.measure((...measurements) => {
                            resolve({ cell, note, measurements })
                        })
                    })
                    promises.push(pro)
                })
            }

            const getCellCordinatesRelativeToBoard = (cellPageX, cellPageY) => ({
                x: cellPageX - boardPageX,
                y: cellPageY - boardPageY,
            })

            Promise.all(promises).then(notesMeasurements => {
                // format all notes measurements for ease of access

                consoleLog('@@@@@ all notes measurements', notesMeasurements)

                const notesWithMeasurements = _reduce(notesMeasurements, (acc, current) => {
                    const { cell: { row, col }, note, measurements } = current
                    return _set(acc, [row, col, note], measurements)
                }, [])

                const svgElementsArgs = []
                // start from first cell to next and store the svg arguments
                for (let i = 0; i < chainTrack.length; i++) {
                    const { cell: currentSpotCell, in: currentIn, out: currentOut } = chainTrack[i]
                    // highlight all the circles in this spot

                    const notesHighlightArgs = _map(_compact([currentIn, currentOut]), note => {
                        const noteViewMeasurements = notesWithMeasurements[currentSpotCell.row][currentSpotCell.col][note]
                        const [, , cellWidth, cellHeight, cellPageX, cellPageY] = noteViewMeasurements
                        const { x, y } = getCellCordinatesRelativeToBoard(cellPageX, cellPageY)
                        return {
                            element: Circle,
                            props: {
                                cx: x + cellWidth / 2,
                                cy: y + cellHeight / 2,
                                r: cellHeight / 2,
                                fill: 'rgba(217, 19, 235, 0.4)',
                            },
                        }
                    })
                    // svgElementsArgs.push(...notesHighlightArgs)

                    if (i + 1 < chainTrack.length) {
                        const currentCellOutNoteViewMeasurements = notesWithMeasurements[currentSpotCell.row][currentSpotCell.col][currentOut]
                        const [, , cellWidth, cellHeight, currentCellPageX, currentCellPageY] = currentCellOutNoteViewMeasurements
                        const { x: currentCellBoardX, y: currentCellBoardY } = getCellCordinatesRelativeToBoard(currentCellPageX, currentCellPageY)

                        const { cell: nextSpotCell, in: nextSpotIn, out: nextSpotOut } = chainTrack[i + 1]
                        const nextCellInNoteViewMeasurements = notesWithMeasurements[nextSpotCell.row][nextSpotCell.col][nextSpotIn]
                        const [, , , , nextCellPageX, nextCellPageY] = nextCellInNoteViewMeasurements
                        const { x: nextCellBoardX, y: nextCellBoardY } = getCellCordinatesRelativeToBoard(nextCellPageX, nextCellPageY)
                        // TODO: make these lines curved

                        const startPoint = {
                            x: currentCellBoardX + cellWidth / 2,
                            y: currentCellBoardY + cellHeight / 2,
                        }
                        const endPoint = {
                            x: nextCellBoardX + cellWidth / 2,
                            y: nextCellBoardY + cellHeight / 2,
                        }
                        const line = { start: startPoint, end: endPoint }
                        const { centerA, centerB } = getCurveCenters(line)

                        /** finding the angle between lines starts here */
                        const aLine = { start: startPoint, end: endPoint }
                        const nextCellOutNoteViewMeasurements = notesWithMeasurements[nextSpotCell.row][nextSpotCell.col][nextSpotOut]
                        const [, , , , nextCellPageXOut, nextCellPageYOut] = nextCellOutNoteViewMeasurements
                        const { x: nextCellBoardXOut, y: nextCellBoardYOut } = getCellCordinatesRelativeToBoard(nextCellPageXOut, nextCellPageYOut)
                        const bLine = { start: startPoint, end: { x: nextCellBoardXOut + cellWidth / 2, y: nextCellBoardYOut + cellHeight / 2 } } // next cell another note

                        consoleLog('angle between lines', getAngleBetweenLines(aLine, bLine))

                        /** finding the angle between lines ends here */

                        const { closeToStart, closeToEnd } = getPointsOnLineFromEndpoints(line, 6) // 7 units offset

                        const path = [
                            // straight line without offsets
                            // 'M', startPoint.x, startPoint.y,
                            // 'L', endPoint.x, endPoint.y,

                            // straight line with offsets
                            'M', closeToStart.x, closeToStart.y,
                            'L', closeToEnd.x, closeToEnd.y,

                            // curve with offsets
                            // 'M', closeToStart.x, closeToStart.y,
                            // 'C', centerA.x, centerA.y, centerB.x, centerB.y, closeToEnd.x, closeToEnd.y,

                            // curve without offsets
                            // 'M', startPoint.x, startPoint.y,
                            // 'C', centerA.x, centerA.y, centerB.x, centerB.y, endPoint.x, endPoint.y,
                            // 'L', endPoint.x, endPoint.y,
                        ].join(' ')

                        svgElementsArgs.push({
                            element: Path,
                            props: {
                                d: path,
                            },
                            // markerID: i === (chainTrack.length - 2) ? 'ShortLinkTriangle' : 'LongLinkTriangle',
                        })
                    }
                }

                resolve({
                    svgElements: svgElementsArgs,
                    boardXPos: boardPageX,
                    boardYPos: boardPageY,
                })
            })
        })
    })
}

// const fontColor = 'rgb(0, 255, 0)'
const fontColor = 'green'
const linkColor = 'rgb(217, 19, 235)'
// const linkColor = 'rgb(0, 255, 0)'
//
// const fontColor = 'rgb(97, 64, 81)'
// const linkColor = 'rgba(97, 64, 81, 0.6)'

const Board_ = ({
    screenName,
    gameState,
    mainNumbers,
    notes,
    selectedCell,
    onCellClick,
    isHintTryOut,
    showSmartHint,
    // cellsHighlightData,
    axisTextStyles,
}) => {
    const { BOARD_GRID_WIDTH, BOARD_GRID_HEIGHT, CELL_WIDTH } = useBoardElementsDimensions()

    const cellsHighlightData = {
        2: {
            2: {
                notesToHighlightData: {
                    1: { fontColor: 'rgb(217, 19, 235)' },
                    2: { fontColor },
                },
            },
            3: {
                notesToHighlightData: {
                    2: { fontColor },
                    1: { fontColor: 'rgb(217, 19, 235)' },
                },
            },
        },
    }

    const styles = useMemo(() => getStyles({ BOARD_GRID_HEIGHT, BOARD_GRID_WIDTH, CELL_WIDTH }), [BOARD_GRID_WIDTH, BOARD_GRID_HEIGHT, CELL_WIDTH])

    const selectedCellMainValue = _get(mainNumbers, [selectedCell.row, selectedCell.col, 'value'], 0)

    const sameValueAsSelectedBox = cell => selectedCellMainValue && selectedCellMainValue === mainNumbers[cell.row][cell.col].value

    const [outlineState, setPath] = useState({ svgElements: [], boardYPos: -1, boardXPos: -1 })

    const boardRef = useRef(null)

    const notesRefs = useMemo(() => {
        const result = []
        forBoardEachCell(({ row, col }) => {
            forCellEachNote((_, noteIdx) => {
                _set(result, [row, col, noteIdx], React.createRef())
            })
        })
        return result
    }, [])

    useEffect(() => {
        const handler = async () => {
            setPath(await getChainPath(notesRefs, boardRef))
        }
        setTimeout(handler, 4000)
    }, [])

    const renderChain = () => {
        if (_isEmpty(outlineState.svgElements)) return null

        return (
            <HintsSvgDrawing
                hint={{ id: HINTS_IDS.REMOTE_PAIRS }}
                outlineState={outlineState}
            >
                {
                    _map(outlineState.svgElements, ({ element: Element, markerID = MARKER_TYPES.LONG_LINK, props }) => (
                        <Element
                            {...props}
                            // stroke="red"
                            // stroke="rgba(255, 0, 0, 0.6)"
                            stroke={linkColor}
                            strokeWidth={SVG_STROKE_WIDTH}
                            strokeLinejoin="round"
                            strokeDasharray="6, 4"
                            {... (Element === Path) && { markerEnd: `url(#${markerID})` }}
                        />
                    ))
                }
            </HintsSvgDrawing>
        )
    }

    const getCustomPuzzleMainNumFontColor = cell => {
        const isWronglyPlaced = mainNumbers[cell.row][cell.col].wronglyPlaced
        if (isWronglyPlaced) return styles.wronglyFilledNumColor
        // consider any other number as clue
        return styles.clueNumColor
    }

    const isCustomPuzleScreen = () => screenName === SCREEN_NAME.CUSTOM_PUZZLE

    const getMainNumFontColor = cell => {
        const { row, col } = cell
        if (!mainNumbers[row][col].value) return null
        if (isCustomPuzleScreen()) return getCustomPuzzleMainNumFontColor(cell)

        if (isHintTryOut && cellHasTryOutInput(cell)) return styles.tryOutInputColor

        if (showSmartHint) return styles.clueNumColor

        if (mainNumbers[row][col].value !== mainNumbers[row][col].solutionValue) return styles.wronglyFilledNumColor
        if (!mainNumbers[row][col].isClue) return styles.userFilledNumColor
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

        const isSameHouseAsSelected = areCommonHouseCells(cell, selectedCell)
        const isSameValueAsSelected = sameValueAsSelectedBox(cell)
        if (isSameHouseAsSelected) return styles.sameHouseCellBGColor
        if (!isSameHouseAsSelected && isSameValueAsSelected) return styles.diffHouseSameValueBGColor
        return styles.defaultCellBGColor
    }

    const getCellBackgroundColor = cell => {
        if (!shouldShowCellContent()) return null
        if (showSmartHint) return getSmartHintActiveBgColor(cell)
        if (isCustomPuzleScreen()) return getCustomPuzzleBoardCellBgColor(cell)
        return getActiveGameBoardCellBgCell(cell)
    }

    const shouldMarkCellAsInhabitable = cell => _get(cellsHighlightData, [cell.row, cell.col, 'inhabitable'], false)

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
                        <View style={[styles.cellContainer, cellAdditionalStyles]} key={`${index}`}>
                            <Cell
                                row={row}
                                col={col}
                                cellBGColor={getCellBackgroundColor(cell)}
                                mainValueFontColor={getMainNumFontColor(cell)}
                                cellMainValue={mainNumbers[row][col].value}
                                cellNotes={_get(notes, [row, col])}
                                onCellClick={onCellClick}
                                displayCrossIcon={shouldMarkCellAsInhabitable(cell)}
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

    const renderAxisText = label => <Text style={[showSmartHint ? styles.smartHintAxisText : styles.axisText, axisTextStyles]}>{label}</Text>

    const yAxis = useMemo(() => <View style={styles.yAxis}>{BOARD_AXES_VALUES.Y_AXIS.map(label => renderAxisText(label))}</View>, [showSmartHint])

    const xAxis = useMemo(() => <View style={styles.xAxis}>{BOARD_AXES_VALUES.X_AXIS.map(label => renderAxisText(label))}</View>, [showSmartHint])

    const renderBoard = () => (
        <View
            ref={boardRef}
            style={[styles.board, showSmartHint ? { zIndex: 1 } : null]}
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
            {renderChain()}
        </>
    )
}

export const Board = React.memo(Board_)

Board_.propTypes = {
    mainNumbers: PropTypes.array,
    notes: PropTypes.array,
    screenName: PropTypes.string,
    gameState: PropTypes.string,
    selectedCell: PropTypes.object,
    onCellClick: PropTypes.func,
    isHintTryOut: PropTypes.bool,
    showSmartHint: PropTypes.bool,
    cellsHighlightData: PropTypes.object,
    axisTextStyles: PropTypes.object,
}

Board_.defaultProps = {
    screenName: '',
    gameState: GAME_STATE.INACTIVE,
    selectedCell: {},
    onCellClick: _noop,
    isHintTryOut: false,
    showSmartHint: false,
    cellsHighlightData: {},
    axisTextStyles: {},
}
