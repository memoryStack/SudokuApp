import { Path } from 'react-native-svg'

import _compact from '@lodash/compact'
import _forEach from '@lodash/forEach'
import _reduce from '@lodash/reduce'

import { roundToNearestPixel } from '../../../../../utils/util'

import { MARKER_TYPES } from '../../svgDefs/remotePairs/remotePairs.constants'

import {
    getCurveCenters,
    getPointsOnLineFromEndpoints,
    isOneStepLink,
    shouldCurveLink,
    getCurveDirection,
} from './helpers/remotePairs.helpers'
import LinkReader from './readers/link.reader'
import { LINK_ENDPOINTS_OFFSET } from './remotePairs.constants'

// TODO: hint generator will send this color
const linkColor = 'rgb(217, 19, 235)'

const strokeProps = {
    stroke: linkColor,
    strokeWidth: roundToNearestPixel(2),
    strokeLinejoin: 'round',
    strokeDasharray: '6, 4',
}

// TODO: get link color and chain details as well in args
const getRemotePairsSvgElementsConfigs = async ({ notesRefs, boardPageCordinates, svgProps: chainTrack }) => new Promise(resolve => {
    // consoleLog('@@@@@@ chaintrack', chainTrack)

    Promise.all(getAllNotesMeasurePromises(notesRefs, chainTrack)).then(notesRawMeasurements => {
        // console.log('@@@@@@ notesmeasue', notesRawMeasurements)

        const notesMeasurements = transformNotesMeasurementPromisesResult(notesRawMeasurements)

        // console.log('@@@@@@ notesmeasue', notesMeasurements)

        const svgElementsArgs = []
        for (let i = 1; i < chainTrack.length; i++) {
            const { cell: startCell, out: startNote } = chainTrack[i - 1]
            const { cell: endCell, in: endNote } = chainTrack[i]

            const link = {
                start: { cell: startCell, note: startNote },
                end: { cell: endCell, note: endNote },
            }
            const linkCoordinates = getLinkCoordinates(link, notesMeasurements, boardPageCordinates)

            // console.log('@@@@@ lc', linkCoordinates)

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
                    noteRef.current && noteRef.current.measure((...measurements) => {
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
    if (!acc[row]) acc[row] = {}
    if (!acc[row][col]) acc[row][col] = {}
    acc[row][col][note] = measurements
    return acc
}, {})

const getLinkCoordinates = (link, notesMeasurements, boardPageCordinates) => {
    const startCell = LinkReader.startCell(link)
    const endCell = LinkReader.endCell(link)
    const startNote = LinkReader.startNote(link)
    const endNote = LinkReader.endNote(link)

    const startCellMeasurements = notesMeasurements[startCell.row][startCell.col][startNote]
    const endCellMeasurements = notesMeasurements[endCell.row][endCell.col][endNote]

    const startCellBoardCoordinates = getNotePositionRelativeToBoard(startCellMeasurements, boardPageCordinates)
    const endCellBoardCoordinates = getNotePositionRelativeToBoard(endCellMeasurements, boardPageCordinates)

    // console.log('@@@@@@ cells measurements', startCellBoardCoordinates, boardPageCordinates)
    // console.log('@@@@@@ cells measurements', endCellBoardCoordinates)

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
