import { areSameColCells, areSameRowCells } from '../utils/util'

export const CURVER_DIRECTIONS = {
    CLOCKWISE: 'CLOCKWISE',
    ANTI_CLOCKWISE: 'ANTI_CLOCKWISE',
}

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

// TODO: remote it, most likely won't be used
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
    const cellsPair = [startCell, endCell]

    const areFirstRowCell = areSameRowCells(cellsPair) && startCell.row === 0
    if (areFirstRowCell) {
        return startCell.col < endCell.col ? CURVER_DIRECTIONS.ANTI_CLOCKWISE : CURVER_DIRECTIONS.CLOCKWISE
    }

    const areLastRowCell = areSameRowCells(cellsPair) && startCell.row === 8
    if (areLastRowCell) {
        return startCell.col < endCell.col ? CURVER_DIRECTIONS.CLOCKWISE : CURVER_DIRECTIONS.ANTI_CLOCKWISE
    }

    const areFirstColCell = areSameColCells(cellsPair) && startCell.col === 0
    if (areFirstColCell) {
        return startCell.row < endCell.row ? CURVER_DIRECTIONS.CLOCKWISE : CURVER_DIRECTIONS.ANTI_CLOCKWISE
    }

    const areLastColCell = areSameColCells(cellsPair) && startCell.col === 8
    if (areLastColCell) {
        return startCell.row < endCell.row ? CURVER_DIRECTIONS.ANTI_CLOCKWISE : CURVER_DIRECTIONS.CLOCKWISE
    }

    return CURVER_DIRECTIONS.CLOCKWISE
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
