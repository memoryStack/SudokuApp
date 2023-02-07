import { getRoatatedPoint } from './curvePath.utils'

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
