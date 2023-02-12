import { areSameColCells, areSameRowCells } from '../../../../utils/util'
import { ONE_STEP_LINK_DIRECTIONS, CURVE_DIRECTIONS } from '../remotePairs.constants'

function degToRad(deg) {
    return deg * (Math.PI / 180.0)
}

function radToDeg(rad) {
    return rad * (180.0 / Math.PI)
}

export const getRoatatedPoint = (point, pivot, angleInDegree) => {
    const angleInRadian = degToRad(angleInDegree)

    const shiftedPoint = {
        x: point.x - pivot.x,
        y: point.y - pivot.y,
    }

    const rotatedShiftedPoint = {
        x: shiftedPoint.x * Math.cos(angleInRadian) - shiftedPoint.y * Math.sin(angleInRadian),
        y: shiftedPoint.x * Math.sin(angleInRadian) + shiftedPoint.y * Math.cos(angleInRadian),
    }

    return {
        x: rotatedShiftedPoint.x + pivot.x,
        y: rotatedShiftedPoint.y + pivot.y,
    }
}

const getLineSegmentLength = line => {
    const { start, end } = line
    return Math.sqrt((start.x - end.x) ** 2 + (start.y - end.y) ** 2)
}

export const getPointsOnLineFromEndpoints = (line, distanceOnLine) => {
    const segmentLength = getLineSegmentLength(line)
    const { start, end } = line

    const closeToStart = {
        x: start.x + ((end.x - start.x) * distanceOnLine) / segmentLength,
        y: start.y + ((end.y - start.y) * distanceOnLine) / segmentLength,
    }

    const closeToEnd = {
        x: end.x - ((end.x - start.x) * distanceOnLine) / segmentLength,
        y: end.y - ((end.y - start.y) * distanceOnLine) / segmentLength,
    }

    return {
        closeToStart,
        closeToEnd,
    }
}

// TODO: remove it, most likely won't be used
export const getAngleBetweenLines = (aLine, bLine) => {
    const aVector = {
        x: aLine.end.x - aLine.start.x,
        y: aLine.end.y - aLine.start.y,
    }
    const bVector = {
        x: bLine.end.x - bLine.start.x,
        y: bLine.end.y - bLine.start.y,
    }
    const vectorsDotProduct = aVector.x * bVector.x + aVector.y * bVector.y
    return radToDeg(Math.acos(vectorsDotProduct / getLineSegmentLength(aLine) / getLineSegmentLength(bLine)))
}

export const shouldCurveLink = (linkStart, linkEnd) => {
    const cellsPair = [linkStart.cell, linkEnd.cell]
    const cellsInSameRow = areSameRowCells(cellsPair)
    const cellsInSameCol = areSameColCells(cellsPair)
    if (!cellsInSameRow && !cellsInSameCol) return false

    const startNoteIndex = linkStart.note - 1
    const endNoteIndex = linkEnd.note - 1
    if (cellsInSameRow) return Math.floor(startNoteIndex / 3) === Math.floor(endNoteIndex / 3)
    return (startNoteIndex % 3) === (endNoteIndex % 3)
}

export const getCurveDirection = (startCell, endCell) => {
    // TODO: remove magic numbers from here
    const cellsPair = [startCell, endCell]

    const areFirstRowCell = areSameRowCells(cellsPair) && startCell.row === 0
    if (areFirstRowCell) {
        return startCell.col < endCell.col ? CURVE_DIRECTIONS.ANTI_CLOCKWISE : CURVE_DIRECTIONS.CLOCKWISE
    }

    const areLastRowCell = areSameRowCells(cellsPair) && startCell.row === 8
    if (areLastRowCell) {
        return startCell.col < endCell.col ? CURVE_DIRECTIONS.CLOCKWISE : CURVE_DIRECTIONS.ANTI_CLOCKWISE
    }

    const areFirstColCell = areSameColCells(cellsPair) && startCell.col === 0
    if (areFirstColCell) {
        return startCell.row < endCell.row ? CURVE_DIRECTIONS.CLOCKWISE : CURVE_DIRECTIONS.ANTI_CLOCKWISE
    }

    const areLastColCell = areSameColCells(cellsPair) && startCell.col === 8
    if (areLastColCell) {
        return startCell.row < endCell.row ? CURVE_DIRECTIONS.ANTI_CLOCKWISE : CURVE_DIRECTIONS.CLOCKWISE
    }

    return CURVE_DIRECTIONS.CLOCKWISE
}

// write util which will give two points on one side only

export const getCurveCenters = line => {
    // const linkType = 'smallLink'
    const linkType = 'longLink'

    // +ve angle rotation will make anticlockwise curve
    // -ve will make clockwise curve

    const segmentLength = getLineSegmentLength(line)

    const curverCentersConfig = {
        smallLink: {
            distanceOnLine: segmentLength * 0.45,
            angleInDegree: 30, // how to know what type of curve it will give
        },
        longLink: {
            distanceOnLine: segmentLength * 0.45,
            angleInDegree: 20,
        },
    }

    const { angleInDegree, distanceOnLine } = curverCentersConfig[linkType]

    const { closeToStart, closeToEnd } = getPointsOnLineFromEndpoints(line, distanceOnLine)
    return {
        centerA: getRoatatedPoint(closeToStart, line.start, angleInDegree),
        centerB: getRoatatedPoint(closeToEnd, line.end, 360 - angleInDegree),
    }
}

// TODO: think about making a reader class for this link object structure
export const isOneStepLink = link => {
    const {
        start: { cell: startCell, note: startNote },
        end: { cell: endCell, note: endNote },
    } = link
    if (!areNeighbourCells(startCell, endCell)) return false

    const linkDirection = getOneStepLinkDirection(startCell, endCell)
    if (linkDirection === ONE_STEP_LINK_DIRECTIONS.LEFT_RIGHT) {
        const startNoteInThirdColumn = startNote % 3 === 0
        const endNoteInFirstColumn = endNote % 3 === 1
        const bothNotesAreInSameHorizontalLine = Math.abs(startNote - endNote) === 2
        return startNoteInThirdColumn && endNoteInFirstColumn && bothNotesAreInSameHorizontalLine
    }

    if (linkDirection === ONE_STEP_LINK_DIRECTIONS.RIGHT_LEFT) {
        const startNoteInFirstColumn = startNote % 3 === 1
        const endNoteInLastColumn = endNote % 3 === 0
        const bothNotesAreInSameHorizontalLine = Math.abs(startNote - endNote) === 2
        return startNoteInFirstColumn && endNoteInLastColumn && bothNotesAreInSameHorizontalLine
    }

    if (linkDirection === ONE_STEP_LINK_DIRECTIONS.TOP_BOTTOM) {
        const startNoteInLastRow = startNote >= 7
        const endNoteInFirstRow = endNote <= 3
        const bothNotesAreInSameVerticalLine = Math.abs(startNote - endNote) === 6
        return startNoteInLastRow && endNoteInFirstRow && bothNotesAreInSameVerticalLine
    }

    if (linkDirection === ONE_STEP_LINK_DIRECTIONS.BOTTOM_TOP) {
        const startNoteInFirstRow = startNote <= 3
        const endNoteInLastRow = endNote >= 7
        const bothNotesAreInSameVerticalLine = Math.abs(startNote - endNote) === 6
        return startNoteInFirstRow && endNoteInLastRow && bothNotesAreInSameVerticalLine
    }

    if (linkDirection === ONE_STEP_LINK_DIRECTIONS.BOTTOM_RIGHT) {
        return startNote === 9 && endNote === 1
    }

    if (linkDirection === ONE_STEP_LINK_DIRECTIONS.TOP_LEFT) {
        return startNote === 1 && endNote === 9
    }

    if (linkDirection === ONE_STEP_LINK_DIRECTIONS.TOP_RIGHT) {
        return startNote === 3 && endNote === 7
    }

    if (linkDirection === ONE_STEP_LINK_DIRECTIONS.BOTTOM_LEFT) {
        return startNote === 7 && endNote === 3
    }

    return false
}

export const areNeighbourCells = (aCell, bCell) => {
    const horizontalSteps = Math.abs(aCell.row - bCell.row)
    const verticalSteps = Math.abs(aCell.col - bCell.col)
    return horizontalSteps < 2 && verticalSteps < 2
}

export const getOneStepLinkDirection = (startCell, endCell) => {
    const verticalSteps = startCell.row - endCell.row
    const horizontalSteps = startCell.col - endCell.col
    const isMovingRight = horizontalSteps < 0
    const isMovingLeft = horizontalSteps > 0
    const isMovingUp = verticalSteps > 0
    const isMovingDown = verticalSteps < 0

    if (isMovingUp && isMovingRight) return ONE_STEP_LINK_DIRECTIONS.TOP_RIGHT
    if (isMovingUp && isMovingLeft) return ONE_STEP_LINK_DIRECTIONS.TOP_LEFT
    if (isMovingDown && isMovingRight) return ONE_STEP_LINK_DIRECTIONS.BOTTOM_RIGHT
    if (isMovingDown && isMovingLeft) return ONE_STEP_LINK_DIRECTIONS.BOTTOM_LEFT
    if (isMovingLeft) return ONE_STEP_LINK_DIRECTIONS.RIGHT_LEFT
    if (isMovingRight) return ONE_STEP_LINK_DIRECTIONS.LEFT_RIGHT
    if (isMovingUp) return ONE_STEP_LINK_DIRECTIONS.BOTTOM_TOP
    return ONE_STEP_LINK_DIRECTIONS.TOP_BOTTOM
}
