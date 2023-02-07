import { getRoatatedPoint, getPointsOnLineFromEndpoints } from './curvePath.utils'

describe('getRoatatedPoint()', () => {
    test('rotates point anticlockwise w.r.t origin', () => {
        const pivot = { x: 0, y: 0 }
        const point = { x: 3, y: 4 }
        const angleInDegree = 90
        const expectedPoint = { x: -4, y: 3 }

        const rotatedPoint = getRoatatedPoint(point, pivot, angleInDegree)
        expect(rotatedPoint.x).toBeCloseTo(expectedPoint.x, 5)
        expect(rotatedPoint.y).toBeCloseTo(expectedPoint.y, 5)
    })

    test('rotates point after rotating w.r.t origin', () => {
        const pivot = { x: 0, y: 0 }
        const point = { x: -3, y: -6 }
        const angleInDegree = 90
        const expectedPoint = { x: 6, y: -3 }

        const rotatedPoint = getRoatatedPoint(point, pivot, angleInDegree)
        expect(rotatedPoint.x).toBeCloseTo(expectedPoint.x, 5)
        expect(rotatedPoint.y).toBeCloseTo(expectedPoint.y, 5)
    })

    test('rotates point after rotating w.r.t origin', () => {
        const pivot = { x: 0, y: 0 }
        const point = { x: 1, y: 0 }
        const angleInDegree = 30
        const expectedPoint = { x: 0.866, y: 0.5 }

        const rotatedPoint = getRoatatedPoint(point, pivot, angleInDegree)
        expect(rotatedPoint.x).toBeCloseTo(expectedPoint.x, 3)
        expect(rotatedPoint.y).toBeCloseTo(expectedPoint.y, 5)
    })

    test('rotates point after rotating w.r.t points other than origin', () => {
        const pivot = { x: -2, y: 3 }
        const point = { x: 3, y: 3 }
        const angleInDegree = 180
        const expectedPoint = { x: -7, y: 3 }

        const rotatedPoint = getRoatatedPoint(point, pivot, angleInDegree)
        expect(rotatedPoint.x).toBeCloseTo(expectedPoint.x, 3)
        expect(rotatedPoint.y).toBeCloseTo(expectedPoint.y, 5)
    })
})

describe('getPointsOnLineFromEndpoints()', () => {
    test('returns points close to both endpoints on horizontal line', () => {
        const line = {
            start: { x: 0, y: 0 },
            end: { x: 4, y: 0 },
        }
        const distance = 1
        const expectedResult = {
            closeToStart: { x: 1, y: 0 },
            closeToEnd: { x: 3, y: 0 },
        }
        expect(getPointsOnLineFromEndpoints(line, distance)).toEqual(expectedResult)
    })

    test('returns points close to both endpoints on vertical line', () => {
        const line = {
            start: { x: 4, y: 0 },
            end: { x: 4, y: 6 },
        }
        const distance = 1
        const expectedResult = {
            closeToStart: { x: 4, y: 1 },
            closeToEnd: { x: 4, y: 5 },
        }
        expect(getPointsOnLineFromEndpoints(line, distance)).toEqual(expectedResult)
    })

    test('works fine for general line as well', () => {
        const line = {
            end: { x: -1, y: -1 },
            start: { x: 3, y: 7 },
        }
        const distance = 2.2360679775
        const expectedResult = {
            closeToStart: { x: 2, y: 5 },
            closeToEnd: { x: 0, y: 1 },
        }

        const returnedResult = getPointsOnLineFromEndpoints(line, distance)
        expect(returnedResult.closeToStart.x).toBeCloseTo(expectedResult.closeToStart.x, 5)
        expect(returnedResult.closeToStart.y).toBeCloseTo(expectedResult.closeToStart.y, 5)
        expect(returnedResult.closeToEnd.y).toBeCloseTo(expectedResult.closeToEnd.y, 5)
        expect(returnedResult.closeToEnd.x).toBeCloseTo(expectedResult.closeToEnd.x, 5)
    })
})
