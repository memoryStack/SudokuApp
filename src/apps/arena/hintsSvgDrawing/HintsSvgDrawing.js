import React, { memo, useState, useEffect } from 'react'

import { View } from 'react-native'

import { Svg, Path } from 'react-native-svg'

import _map from 'lodash/src/utils/map'
import _isNil from 'lodash/src/utils/isNil'
import _compact from 'lodash/src/utils/compact'
import _forEach from 'lodash/src/utils/forEach'
import _set from 'lodash/src/utils/set'
import _reduce from 'lodash/src/utils/reduce'
import _isEmpty from 'lodash/src/utils/isEmpty'

import { roundToNearestPixel } from '../../../utils/util'

import {
    getCurveCenters,
    getPointsOnLineFromEndpoints,
} from '../gameBoard/curvePath.utils'
import { useBoardElementsDimensions } from '../hooks/useBoardElementsDimensions'

import { MARKER_TYPES } from './svgDefs/remotePairs/remotePairs.constants'
import { HINT_ID_VS_SVG_DEFS } from './svgDefs'

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

                const notesWithMeasurements = _reduce(notesMeasurements, (acc, current) => {
                    const { cell: { row, col }, note, measurements } = current
                    return _set(acc, [row, col, note], measurements)
                }, [])

                const svgElementsArgs = []
                // start from first cell to next and store the svg arguments
                for (let i = 0; i < chainTrack.length; i++) {
                    const { cell: currentSpotCell, in: currentIn, out: currentOut } = chainTrack[i]
                    // highlight all the circles in this spot

                    // const notesHighlightArgs = _map(_compact([currentIn, currentOut]), note => {
                    //     const noteViewMeasurements = notesWithMeasurements[currentSpotCell.row][currentSpotCell.col][note]
                    //     const [, , cellWidth, cellHeight, cellPageX, cellPageY] = noteViewMeasurements
                    //     const { x, y } = getCellCordinatesRelativeToBoard(cellPageX, cellPageY)
                    //     return {
                    //         element: Circle,
                    //         props: {
                    //             cx: x + cellWidth / 2,
                    //             cy: y + cellHeight / 2,
                    //             r: cellHeight / 2,
                    //             fill: 'rgba(217, 19, 235, 0.4)',
                    //         },
                    //     }
                    // })
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

const linkColor = 'rgb(217, 19, 235)'

// it needs all the refs of board and all notes and all the data
// which is needed by hints to generate the svg details
const HintsSvgDrawing = ({
    boardRef, notesRefs, hint,
}) => {
    const {
        BOARD_GRID_WIDTH: SVG_CONTAINER_WIDTH,
        BOARD_GRID_HEIGHT: SVG_CONTAINER_HEIGHT,
    } = useBoardElementsDimensions()

    const [outlineState, setPath] = useState({ svgElements: [], boardYPos: -1, boardXPos: -1 })

    useEffect(() => {
        const handler = async () => {
            setPath(await getChainPath(notesRefs, boardRef))
        }
        setTimeout(handler, 4000)
    }, [])

    const getDefs = () => {
        const DefsComponent = HINT_ID_VS_SVG_DEFS[hint.id]
        if (_isNil(DefsComponent)) return null
        return <DefsComponent />
    }

    if (_isEmpty(outlineState.svgElements)) return null

    return (
        <View
            style={{
                width: SVG_CONTAINER_WIDTH,
                height: SVG_CONTAINER_HEIGHT,
                position: 'absolute',
                zIndex: 1,
                overflow: 'visible',
                top: outlineState.boardYPos,
                left: outlineState.boardXPos,
            }}
            pointerEvents="none"
        >
            <Svg
                viewBox={`0 0 ${SVG_CONTAINER_WIDTH} ${SVG_CONTAINER_HEIGHT}`}
                width={SVG_CONTAINER_WIDTH}
                height={SVG_CONTAINER_HEIGHT}
                overflow="visible"
            >
                {getDefs()}
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
            </Svg>
        </View>
    )
}

// TODO: add prop types

export default memo(HintsSvgDrawing)
