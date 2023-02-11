import { Path } from 'react-native-svg'

import _compact from 'lodash/src/utils/compact'
import _forEach from 'lodash/src/utils/forEach'
import _set from 'lodash/src/utils/set'
import _reduce from 'lodash/src/utils/reduce'

import {
    getCurveCenters,
    getPointsOnLineFromEndpoints,
} from './helpers/curvePath.helpers'
import { MARKER_TYPES } from '../../svgDefs/remotePairs/remotePairs.constants'
import { roundToNearestPixel } from '../../../../../utils/util'

const linkColor = 'rgb(217, 19, 235)'

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

const strokeProps = {
    stroke: linkColor,
    strokeWidth: roundToNearestPixel(2),
    strokeLinejoin: 'round',
    strokeDasharray: '6, 4',
}

const getRemotePairsSvgElementsConfigs = async ({ notesRefs, boardPageCordinates }) => new Promise(resolve => {
    Promise.all(getAllNotesMeasurePromises(notesRefs, chainTrack)).then(notesMeasurements => {
        const notesWithMeasurements = transformNotesMeasurementPromisesResult(notesMeasurements)

        const svgElementsArgs = []
        for (let i = 0; i < chainTrack.length; i++) {
            const { cell: currentSpotCell, out: currentOut } = chainTrack[i] // arrow exit cell

            if (i + 1 < chainTrack.length) {
                const currentCellOutNoteViewMeasurements = notesWithMeasurements[currentSpotCell.row][currentSpotCell.col][currentOut]
                const [, , cellWidth, cellHeight, currentCellPageX, currentCellPageY] = currentCellOutNoteViewMeasurements
                const { x: currentCellBoardX, y: currentCellBoardY } = getCordinatesRelativeToReference({ x: currentCellPageX, y: currentCellPageY }, boardPageCordinates)

                const { cell: nextSpotCell, in: nextSpotIn } = chainTrack[i + 1] // arrow entry cell
                const nextCellInNoteViewMeasurements = notesWithMeasurements[nextSpotCell.row][nextSpotCell.col][nextSpotIn]
                const [, , , , nextCellPageX, nextCellPageY] = nextCellInNoteViewMeasurements
                const { x: nextCellBoardX, y: nextCellBoardY } = getCordinatesRelativeToReference({ x: nextCellPageX, y: nextCellPageY }, boardPageCordinates)
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
                        ...strokeProps,
                        markerEnd: `url(#${MARKER_TYPES.LONG_LINK})`,
                    },
                })
            }
        }

        resolve(svgElementsArgs)
    })
})

const getAllNotesMeasurePromises = (notesRefs, chainTrack) => {
    const result = []

    _forEach(chainTrack, ({ cell, in: entryNote, out: exitNote }) => {
        const notesToMeasure = _compact([entryNote, exitNote])
        _forEach(notesToMeasure, note => {
            const noteRef = notesRefs[cell.row][cell.col][note - 1]
            if (noteRef) {
                result.push(new Promise(resolve => {
                    noteRef.current.measure((...measurements) => {
                        resolve({ cell, note, measurements })
                    })
                }))
            }
        })
    })

    return result
}

// TODO: this will be used at multiple places
// plan to write a geometry class for my svg requirements
const getCordinatesRelativeToReference = (elementCordinates, referencePoint) => ({
    x: elementCordinates.x - referencePoint.x,
    y: elementCordinates.y - referencePoint.y,
})

const transformNotesMeasurementPromisesResult = notesMeasurements => _reduce(notesMeasurements, (acc, current) => {
    const { cell: { row, col }, note, measurements } = current
    return _set(acc, [row, col, note], measurements)
}, [])

export default getRemotePairsSvgElementsConfigs
