import { Path } from 'react-native-svg'

import _forEach from '@lodash/forEach'
import _reduce from '@lodash/reduce'

import { LINK_TYPES } from 'src/apps/arena/utils/smartHints/xChain/xChain.constants'
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

const STROKE_DASH_ARRAY = '6, 4'

const strokeProps = {
    stroke: linkColor,
    strokeWidth: roundToNearestPixel(1.75),
    strokeLinejoin: 'round',
}

// TODO: get link color and chain details as well in args
const getRemotePairsSvgElementsConfigs = async ({ notesRefs, boardPageCordinates, svgProps: chainTrack }) => new Promise(resolve => {
    Promise.all(getAllNotesMeasurePromises(notesRefs, chainTrack)).then(notesRawMeasurements => {
        const notesMeasurements = transformNotesMeasurementPromisesResult(notesRawMeasurements)

        const svgElementsArgs = []
        for (let i = 0; i < chainTrack.length; i++) {
            const { start, end, type: linkType = LINK_TYPES.WEAK } = chainTrack[i]
            const link = { start, end }
            const linkCoordinates = getLinkCoordinates(link, notesMeasurements, boardPageCordinates)
            const linkMarker = isOneStepLink(link) ? MARKER_TYPES.SHORT_LINK : MARKER_TYPES.LONG_LINK

            svgElementsArgs.push({
                element: Path,
                props: {
                    d: getLinkPathGeometry(link, linkCoordinates),
                    ...strokeProps,
                    markerEnd: `url(#${linkMarker})`,
                    ...(linkType === LINK_TYPES.WEAK && { strokeDasharray: STROKE_DASH_ARRAY }),
                },
            })
        }

        resolve(svgElementsArgs)
    })
})

const getAllNotesMeasurePromises = (notesRefs, chainTrack) => {
    const result = []

    _forEach(chainTrack, link => {
        const start = LinkReader.start(link)
        const end = LinkReader.end(link)

        const notesToMeasure = [start, end]
        _forEach(notesToMeasure, ({ cell, note }) => {
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
