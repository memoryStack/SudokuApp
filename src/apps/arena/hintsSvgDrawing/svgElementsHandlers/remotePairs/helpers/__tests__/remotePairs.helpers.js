import {
    getRoatatedPoint,
    getPointsOnLineFromEndpoints,
    getAngleBetweenLines,
    shouldCurveLink,
    getCurveDirection,
    isOneStepLink,
    areNeighbourCells,
    getOneStepLinkDirection,
} from '../remotePairs.helpers'

import { ONE_STEP_LINK_DIRECTIONS, CURVE_DIRECTIONS } from '../../remotePairs.constants'
import { consoleLog } from '../../../../../../../utils/util'

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

describe('getAngleBetweenLines()', () => {
    test('returns angle in degree between two lines', () => {
        const aLine = {
            start: { x: 0, y: 0 },
            end: { x: 0, y: 1 },
        }
        const bLine = {
            start: { x: 0, y: 0 },
            end: { x: 1, y: 0 },
        }
        expect(getAngleBetweenLines(aLine, bLine)).toBeCloseTo(90, 2)
    })

    test('returns angle in degree between two lines', () => {
        const aLine = {
            start: { x: 1, y: 2 },
            end: { x: 4, y: 4 },
        }
        const bLine = {
            start: { x: 4, y: 4 },
            end: { x: 1, y: 6 },
        }
        expect(getAngleBetweenLines(aLine, bLine)).toBeCloseTo(112.619)
    })
})

describe('shouldCurveLink()', () => {
    test('returns false if start and end cells do not make horizontal or vertical straight lines', () => {
        const linkStart = {
            cell: { row: 0, col: 0 },
            note: 1,
        }
        const linkEnd = {
            cell: { row: 2, col: 2 },
            note: 1,
        }
        expect(shouldCurveLink(linkStart, linkEnd)).toBe(false)
    })

    test('returns true if cells are in same row and startNote and endNote are in same horizontal line', () => {
        const linkStart = {
            cell: { row: 0, col: 0 },
            note: 1,
        }
        const linkEnd = {
            cell: { row: 0, col: 4 },
            note: 3,
        }
        expect(shouldCurveLink(linkStart, linkEnd)).toBe(true)
    })

    test('returns false if cells are in same row but startNote and endNote are not in same horizontal line', () => {
        const linkStart = {
            cell: { row: 0, col: 0 },
            note: 4,
        }
        const linkEnd = {
            cell: { row: 0, col: 4 },
            note: 9,
        }
        expect(shouldCurveLink(linkStart, linkEnd)).toBe(false)
    })

    test('returns true if cells are in same column and startNote and endNote are in same vertical line', () => {
        const linkStart = {
            cell: { row: 2, col: 2 },
            note: 2,
        }
        const linkEnd = {
            cell: { row: 4, col: 2 },
            note: 8,
        }
        expect(shouldCurveLink(linkStart, linkEnd)).toBe(true)
    })

    test('returns false if cells are in same column but startNote and endNote are not in same vertical line', () => {
        const linkStart = {
            cell: { row: 2, col: 2 },
            note: 2,
        }
        const linkEnd = {
            cell: { row: 4, col: 2 },
            note: 9,
        }
        expect(shouldCurveLink(linkStart, linkEnd)).toBe(false)
    })
})

describe('getCurveDirection()', () => {
    describe('first row links', () => {
        test('should turn anti-clockwise while moving from left to right in first row', () => {
            const startCell = { row: 0, col: 2 }
            const endCell = { row: 0, col: 6 }
            expect(getCurveDirection(startCell, endCell)).toBe(CURVE_DIRECTIONS.ANTI_CLOCKWISE)
        })

        test('should turn clockwise while moving from right to left in first row', () => {
            const startCell = { row: 0, col: 6 }
            const endCell = { row: 0, col: 2 }
            expect(getCurveDirection(startCell, endCell)).toBe(CURVE_DIRECTIONS.CLOCKWISE)
        })
    })

    describe('last row links', () => {
        test('should turn clockwise while moving from left to right in last row', () => {
            const startCell = { row: 8, col: 2 }
            const endCell = { row: 8, col: 6 }
            expect(getCurveDirection(startCell, endCell)).toBe(CURVE_DIRECTIONS.CLOCKWISE)
        })

        test('should turn anti-clockwise while moving from right to left in last row', () => {
            const startCell = { row: 8, col: 6 }
            const endCell = { row: 8, col: 2 }
            expect(getCurveDirection(startCell, endCell)).toBe(CURVE_DIRECTIONS.ANTI_CLOCKWISE)
        })
    })

    describe('first column links', () => {
        test('should turn anti-clockwise while moving from bottom to top in first column', () => {
            const startCell = { row: 4, col: 0 }
            const endCell = { row: 2, col: 0 }
            expect(getCurveDirection(startCell, endCell)).toBe(CURVE_DIRECTIONS.ANTI_CLOCKWISE)
        })

        test('should turn clockwise while moving from top to bottom in first column', () => {
            const startCell = { row: 2, col: 0 }
            const endCell = { row: 4, col: 0 }
            expect(getCurveDirection(startCell, endCell)).toBe(CURVE_DIRECTIONS.CLOCKWISE)
        })
    })

    describe('last column links', () => {
        test('should turn anti-clockwise while moving from top to bottom in last column', () => {
            const startCell = { row: 2, col: 8 }
            const endCell = { row: 4, col: 8 }
            expect(getCurveDirection(startCell, endCell)).toBe(CURVE_DIRECTIONS.ANTI_CLOCKWISE)
        })

        test('should turn clockwise while moving from bottom to top in last column', () => {
            const startCell = { row: 4, col: 8 }
            const endCell = { row: 2, col: 8 }
            expect(getCurveDirection(startCell, endCell)).toBe(CURVE_DIRECTIONS.CLOCKWISE)
        })
    })

    describe('any other link', () => {
        test('should turn clockwise always if link doesnt fall in above categories', () => {
            const startCell = { row: 0, col: 1 }
            const endCell = { row: 3, col: 1 }
            expect(getCurveDirection(startCell, endCell)).toBe(CURVE_DIRECTIONS.CLOCKWISE)
        })
    })
})

describe('isOneStepLink()', () => {
    test('returns false if cells are not neighbours', () => {
        const link = {
            start: {
                cell: { row: 0, col: 0 },
                note: 3,
            },
            end: {
                cell: { row: 0, col: 4 },
                note: 1,
            },
        }
        expect(isOneStepLink(link)).toBe(false)
    })

    test('returns true when short link is in left-right direction and start note is in third column and end note is in first column', () => {
        const link = {
            start: {
                cell: { row: 0, col: 0 },
                note: 3,
            },
            end: {
                cell: { row: 0, col: 1 },
                note: 1,
            },
        }
        expect(isOneStepLink(link)).toBe(true)
    })

    test('returns true when short link is in right-left direction and start note is in first column and end note is in third column and line joining them is horizontally straight', () => {
        const link = {
            start: {
                cell: { row: 0, col: 1 },
                note: 7,
            },
            end: {
                cell: { row: 0, col: 0 },
                note: 9,
            },
        }
        expect(isOneStepLink(link)).toBe(true)
    })

    test('returns false when short link is in left-right direction and start note is in first column and end note is in third column and line joining them is not horizontally straight', () => {
        const link = {
            start: {
                cell: { row: 0, col: 0 },
                note: 9,
            },
            end: {
                cell: { row: 0, col: 1 },
                note: 1,
            },
        }
        expect(isOneStepLink(link)).toBe(false)
    })

    test.each([[9, 3], [8, 2], [7, 1]])('returns true when short link is in top-bottom direction and start note is in last row and end note is in first row and line joining them is vertically straight', (startNote, endNote) => {
        const link = {
            start: {
                cell: { row: 0, col: 0 },
                note: startNote,
            },
            end: {
                cell: { row: 1, col: 0 },
                note: endNote,
            },
        }
        expect(isOneStepLink(link)).toBe(true)
    })

    test.each([[9, 1], [5, 2], [7, 2]])('returns false when cells are arranged as top-bottom but link violates one of conditions to be a short link', (startNote, endNote) => {
        const link = {
            start: {
                cell: { row: 0, col: 0 },
                note: startNote,
            },
            end: {
                cell: { row: 1, col: 0 },
                note: endNote,
            },
        }
        expect(isOneStepLink(link)).toBe(false)
    })

    test.each([[1, 7], [2, 8], [3, 9]])('returns true when short link is in bottom-top direction and start note is in first row and end note is in last row and line joining them is vertically straight', (startNote, endNote) => {
        const link = {
            start: {
                cell: { row: 1, col: 0 },
                note: startNote,
            },
            end: {
                cell: { row: 0, col: 0 },
                note: endNote,
            },
        }
        expect(isOneStepLink(link)).toBe(true)
    })

    test('returns true when short link is in bottom-right direction and link notes are closest to touching corner', () => {
        const link = {
            start: {
                cell: { row: 0, col: 0 },
                note: 9,
            },
            end: {
                cell: { row: 1, col: 1 },
                note: 1,
            },
        }
        expect(isOneStepLink(link)).toBe(true)
    })

    test('returns true when short link is in bottom-right direction and one or both of the link notes are not closest to touching corner', () => {
        const link = {
            start: {
                cell: { row: 0, col: 0 },
                note: 8,
            },
            end: {
                cell: { row: 1, col: 1 },
                note: 1,
            },
        }
        expect(isOneStepLink(link)).toBe(false)
    })

    test('returns true when short link is in top-left direction and link notes are closest to touching corner', () => {
        const link = {
            start: {
                cell: { row: 1, col: 1 },
                note: 1,
            },
            end: {
                cell: { row: 0, col: 0 },
                note: 9,
            },
        }
        expect(isOneStepLink(link)).toBe(true)
    })

    test('returns true when short link is in top-right direction and link notes are closest to touching corner', () => {
        const link = {
            start: {
                cell: { row: 1, col: 1 },
                note: 3,
            },
            end: {
                cell: { row: 0, col: 2 },
                note: 7,
            },
        }
        expect(isOneStepLink(link)).toBe(true)
    })

    test('returns true when short link is in bottom-left direction and link notes are closest to touching corner', () => {
        const link = {
            start: {
                cell: { row: 1, col: 1 },
                note: 7,
            },
            end: {
                cell: { row: 2, col: 0 },
                note: 3,
            },
        }
        expect(isOneStepLink(link)).toBe(true)
    })
})

describe('areNeighbourCells()', () => {
    test('returns true when cells are one step away horizontally', () => {
        const aCell = { row: 2, col: 2 }
        const bCell = { row: 2, col: 1 }
        expect(areNeighbourCells(aCell, bCell)).toBe(true)
    })

    test('returns true when cells are one step away vertically', () => {
        const aCell = { row: 2, col: 2 }
        const bCell = { row: 1, col: 2 }
        expect(areNeighbourCells(aCell, bCell)).toBe(true)
    })

    test('returns true when cells are one step away diagonally', () => {
        const aCell = { row: 2, col: 2 }
        const bCell = { row: 1, col: 3 }
        expect(areNeighbourCells(aCell, bCell)).toBe(true)
    })

    test('returns false when cells are multiple steps away from each other in any direction', () => {
        const aCell = { row: 2, col: 2 }
        const bCell = { row: 1, col: 4 }
        expect(areNeighbourCells(aCell, bCell)).toBe(false)
    })
})

describe('getOneStepLinkDirection()', () => {
    test('right-left when end cell is one step left to the start cell in same row', () => {
        const startCell = { row: 2, col: 3 }
        const endCell = { row: 2, col: 2 }
        expect(getOneStepLinkDirection(startCell, endCell)).toBe(ONE_STEP_LINK_DIRECTIONS.RIGHT_LEFT)
    })

    test('left-right when end cell is one step right to the start cell in same row', () => {
        const startCell = { row: 2, col: 2 }
        const endCell = { row: 2, col: 3 }
        expect(getOneStepLinkDirection(startCell, endCell)).toBe(ONE_STEP_LINK_DIRECTIONS.LEFT_RIGHT)
    })

    test('top-right when end cell is one step up and right to the start cell', () => {
        const startCell = { row: 2, col: 2 }
        const endCell = { row: 1, col: 3 }
        expect(getOneStepLinkDirection(startCell, endCell)).toBe(ONE_STEP_LINK_DIRECTIONS.TOP_RIGHT)
    })

    test('bottom-right when end cell is one step down and right to the start cell', () => {
        const startCell = { row: 2, col: 2 }
        const endCell = { row: 3, col: 3 }
        expect(getOneStepLinkDirection(startCell, endCell)).toBe(ONE_STEP_LINK_DIRECTIONS.BOTTOM_RIGHT)
    })
})
