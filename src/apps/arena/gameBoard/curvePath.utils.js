function degToRad(deg) {
    return deg * (Math.PI / 180.0)
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
            angleInDegree: 15,
        },
    }

    const { angleInDegree, distanceOnLine } = curverCentersConfig[linkType]

    const { closeToStart, closeToEnd } = getPointsOnLineFromEndpoints(line, distanceOnLine)
    return {
        centerA: getRoatatedPoint(closeToStart, line.start, angleInDegree),
        centerB: getRoatatedPoint(closeToEnd, line.end, 360 - angleInDegree),
    }
}
