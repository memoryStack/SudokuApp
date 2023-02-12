import { Path } from 'react-native-svg'

import _compact from 'lodash/src/utils/compact'
import _forEach from 'lodash/src/utils/forEach'
import _set from 'lodash/src/utils/set'
import _reduce from 'lodash/src/utils/reduce'

import { roundToNearestPixel } from '../../../../../utils/util'

import { MARKER_TYPES } from '../../svgDefs/remotePairs/remotePairs.constants'

import {
    getCurveCenters,
    getPointsOnLineFromEndpoints,
    isOneStepLink,
    shouldCurveLink,
    getCurveDirection,
} from './helpers/remotePairs.helpers'
import { LINK_ENDPOINTS_OFFSET } from './remotePairs.constants'

// TODO: hint generator will send this color
const linkColor = 'rgb(217, 19, 235)'

const chainTrack = [
    {
        cell: { row: 0, col: 0 },
        out: 5,
    },
    {
        cell: { row: 2, col: 2 },
        in: 3,
        out: 9,
    },
    {
        cell: { row: 5, col: 2 },
        in: 1,
        out: 7,
    },
    {
        cell: { row: 3, col: 4 },
        in: 1,
        out: 7,
    },
    {
        cell: { row: 3, col: 6 },
        in: 7,
        out: 3,
    },
    {
        cell: { row: 4, col: 6 },
        in: 7,
        out: 3,
    },
    {
        cell: { row: 4, col: 7 },
        in: 1,
        out: 3,
    },
]

const strokeProps = {
    stroke: linkColor,
    strokeWidth: roundToNearestPixel(2),
    strokeLinejoin: 'round',
    strokeDasharray: '6, 4',
}

// TODO: get link color and chain details as well in args
const getRemotePairsSvgElementsConfigs = async ({ notesRefs, boardPageCordinates }) => new Promise(resolve => {
    Promise.all(getAllNotesMeasurePromises(notesRefs, chainTrack)).then(notesRawMeasurements => {
        const notesMeasurements = transformNotesMeasurementPromisesResult(notesRawMeasurements)

        const svgElementsArgs = []
        for (let i = 1; i < chainTrack.length; i++) {
            const { cell: startCell, out: startNote } = chainTrack[i - 1]
            const { cell: endCell, in: endNote } = chainTrack[i]

            const link = {
                start: { cell: startCell, note: startNote },
                end: { cell: endCell, note: endNote },
            }
            const linkCoordinates = getLinkCoordinates(link, notesMeasurements, boardPageCordinates)
            const linkMarker = isOneStepLink(link) ? MARKER_TYPES.SHORT_LINK : MARKER_TYPES.LONG_LINK
            svgElementsArgs.push({
                element: Path,
                props: {
                    d: getLinkPathGeometry(link, linkCoordinates),
                    ...strokeProps,
                    markerEnd: `url(#${linkMarker})`,
                },
            })
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

const transformNotesMeasurementPromisesResult = notesMeasurements => _reduce(notesMeasurements, (acc, current) => {
    const { cell: { row, col }, note, measurements } = current
    return _set(acc, [row, col, note], measurements)
}, [])

const getLinkCoordinates = (link, notesMeasurements, boardPageCordinates) => {
    const {
        start: { cell: startCell, note: startNote },
        end: { cell: endCell, note: endNote },
    } = link

    const startCellMeasurements = notesMeasurements[startCell.row][startCell.col][startNote]
    const endCellMeasurements = notesMeasurements[endCell.row][endCell.col][endNote]

    const startCellBoardCoordinates = getNotePositionRelativeToBoard(startCellMeasurements, boardPageCordinates)
    const endCellBoardCoordinates = getNotePositionRelativeToBoard(endCellMeasurements, boardPageCordinates)
    const cellDimensions = {
        width: startCellMeasurements[2],
        height: startCellMeasurements[3],
    }
    return {
        start: getCellCenter(startCellBoardCoordinates, cellDimensions),
        end: getCellCenter(endCellBoardCoordinates, cellDimensions),
    }
}

const getLinkPathGeometry = (link, linkCoordinates) => {
    const { closeToStart, closeToEnd } = getPointsOnLineFromEndpoints(linkCoordinates, LINK_ENDPOINTS_OFFSET)

    if (shouldCurveLink(link) && !isOneStepLink(link)) {
        const curveDirection = getCurveDirection(link)
        const { centerA, centerB } = getCurveCenters(linkCoordinates, curveDirection)
        return [
            'M', closeToStart.x, closeToStart.y,
            'C', centerA.x, centerA.y, centerB.x, centerB.y, closeToEnd.x, closeToEnd.y,
        ].join(' ')
    }
    return [
        'M', closeToStart.x, closeToStart.y,
        'L', closeToEnd.x, closeToEnd.y,
    ].join(' ')
}

const getNotePositionRelativeToBoard = (noteMeasurements, boardPageCordinates) => {
    const [, , , , nextCellPageX, nextCellPageY] = noteMeasurements
    return getCordinatesRelativeToReference({ x: nextCellPageX, y: nextCellPageY }, boardPageCordinates)
}

// TODO: this will be used at multiple places
// plan to write a geometry class for my svg requirements
const getCordinatesRelativeToReference = (elementCordinates, referencePoint) => ({
    x: elementCordinates.x - referencePoint.x,
    y: elementCordinates.y - referencePoint.y,
})

const getCellCenter = (cellTopLeftCorner, cellDimensions) => ({
    x: cellTopLeftCorner.x + cellDimensions.width / 2,
    y: cellTopLeftCorner.y + cellDimensions.height / 2,
})

export default getRemotePairsSvgElementsConfigs
