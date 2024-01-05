import { HIDDEN_SINGLE_TYPES, NAKED_SINGLE_TYPES } from './constants'
import {
    getCellsFromCellsToFocusedData,
    setCellDataInHintResult,
    setCellNotesHighlightDataInHintResult,
    getCandidatesListText,
    removeDuplicteCells,
    generateSinglesMap,
} from './util'

describe('getCellsFromCellsToFocusedData()', () => {
    test('returns cells which are basically the keys mentioned in the cellsToFocusData, first level keys are row numbers and second levels keys are column numbers in each row', () => {
        const cellsToFocusData = {
            0: {
                0: {},
                1: {},
                2: {},
            },
            2: {
                4: {},
                7: {},
                8: {},
            },
        }
        const expectedResult = [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 2, col: 4 },
            { row: 2, col: 7 },
            { row: 2, col: 8 },
        ]

        expect(getCellsFromCellsToFocusedData(cellsToFocusData)).toStrictEqual(expectedResult)
    })
})

describe('setCellDataInHintResult()', () => {
    test('set cell highlight data to the object which contains all cells highlight data', () => {
        const cell = { row: 2, col: 3 }
        const cellHighlightData = { bgColor: 'new cell bg-color' }
        const cellsToFocusData = {
            2: {
                4: {
                    bgColor: 'some value',
                    noteColor: 'some value',
                },
            },
        }
        const expectedResult = {
            2: {
                3: {
                    bgColor: 'new cell bg-color',
                },
                4: {
                    bgColor: 'some value',
                    noteColor: 'some value',
                },
            },
        }
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)

        expect(cellsToFocusData).toStrictEqual(expectedResult)
    })

    test('will override cell highlight data if it already exist', () => {
        const cell = { row: 2, col: 3 }
        const cellHighlightData = { bgColor: 'new bg-color' }
        const cellsToFocusData = {
            2: {
                3: {
                    bgColor: 'old bg-color',
                },
                4: {
                    bgColor: 'some value',
                    noteColor: 'some value',
                },
            },
        }
        const expectedResult = {
            2: {
                3: {
                    bgColor: 'new bg-color',
                },
                4: {
                    bgColor: 'some value',
                    noteColor: 'some value',
                },
            },
        }
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)

        expect(cellsToFocusData).toStrictEqual(expectedResult)
    })

    test('will create entry for cell if it does not exist already', () => {
        const cell = { row: 2, col: 3 }
        const cellHighlightData = { bgColor: 'some color' }
        const cellsToFocusData = {}
        const expectedResult = {
            2: {
                3: {
                    bgColor: 'some color',
                },
            },
        }
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)

        expect(cellsToFocusData).toStrictEqual(expectedResult)
    })
})

describe('setCellNotesHighlightDataInHintResult()', () => {
    test('similar to setCellDataInHintResult function sets cell notes highlight data to the object which contains all cells highlight data', () => {
        const cell = { row: 2, col: 3 }
        const cellNotesHighlightData = { color: 'notes font color' }
        const cellsToFocusData = {
            2: {
                3: {
                    bgColor: 'some color',
                },
                4: {
                    bgColor: 'some value',
                    noteColor: 'some value',
                },
            },
        }
        const expectedResult = {
            2: {
                3: {
                    bgColor: 'some color',
                    notesToHighlightData: { color: 'notes font color' },
                },
                4: {
                    bgColor: 'some value',
                    noteColor: 'some value',
                },
            },
        }
        setCellNotesHighlightDataInHintResult(cell, cellNotesHighlightData, cellsToFocusData)

        expect(cellsToFocusData).toStrictEqual(expectedResult)
    })

    test('will throw error if entry for cell is not already created in the object which contains all cells highlight data', () => {
        // assumption is that if some notes are going to be highlighted in the cell then that particular cells
        // must be highlighted so some data for that cells should be present already in the object
        const cell = { row: 2, col: 3 }
        const cellNotesHighlightData = { color: 'notes font color' }
        const cellsToFocusData = {
            2: {
                4: {
                    bgColor: 'some value',
                    noteColor: 'some value',
                },
            },
        }

        expect(() => setCellNotesHighlightDataInHintResult(cell, cellNotesHighlightData, cellsToFocusData)).toThrow(Error)
    })
})

describe('getCandidatesListText()', () => {
    test('returns list of candidates joined with the given keyword', () => {
        const candidates = [1, 2, 3]
        expect(getCandidatesListText(candidates, 'and')).toBe('1, 2 and 3')
    })

    test('returns candidate as string if only 1 candidate present in list', () => {
        const candidates = [1]
        expect(getCandidatesListText(candidates, 'and')).toBe('1')
    })

    test('returns candidates joined with comma (,) if no conjugation is passed', () => {
        const candidates = [1, 2, 3]
        expect(getCandidatesListText(candidates)).toBe('1, 2, 3')
    })
})

describe('removeDuplicteCells()', () => {
    test('returns a list with unique cells', () => {
        const cells = [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 0 },
        ]
        const expectedResult = [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
        ]
        expect(removeDuplicteCells(cells)).toEqual(expectedResult)
    })
})

describe('generateSinglesMap()', () => {
    test('returns a map of Singles from Naked Singles present in puzzle, it will be used by other hints to not report overlapping hints', () => {
        const nakedSingles = [
            { cell: { row: 1, col: 0 }, mainNumber: 8, type: NAKED_SINGLE_TYPES.MIX },
            { cell: { row: 2, col: 4 }, mainNumber: 1, type: NAKED_SINGLE_TYPES.MIX },
            { cell: { row: 6, col: 1 }, mainNumber: 5, type: NAKED_SINGLE_TYPES.MIX },
            { cell: { row: 7, col: 7 }, mainNumber: 5, type: NAKED_SINGLE_TYPES.MIX },
            { cell: { row: 8, col: 4 }, mainNumber: 5, type: NAKED_SINGLE_TYPES.MIX },
            { cell: { row: 8, col: 5 }, mainNumber: 6, type: NAKED_SINGLE_TYPES.MIX },
        ]
        const expectedResult = {
            9: 8,
            22: 1,
            55: 5,
            70: 5,
            76: 5,
            77: 6,
        }
        expect(generateSinglesMap(nakedSingles)).toEqual(expectedResult)
    })

    test('returns a map of Singles from Hidden Singles present in puzzle', () => {
        const hiddenSingles = [
            { cell: { row: 0, col: 3 }, mainNumber: 8, type: HIDDEN_SINGLE_TYPES.ROW },
            { cell: { row: 0, col: 8 }, mainNumber: 9, type: HIDDEN_SINGLE_TYPES.ROW },
            { cell: { row: 1, col: 6 }, mainNumber: 6, type: HIDDEN_SINGLE_TYPES.ROW },
            { cell: { row: 2, col: 2 }, mainNumber: 9, type: HIDDEN_SINGLE_TYPES.BLOCK },
            { cell: { row: 2, col: 3 }, mainNumber: 6, type: HIDDEN_SINGLE_TYPES.BLOCK },
            { cell: { row: 3, col: 0 }, mainNumber: 1, type: HIDDEN_SINGLE_TYPES.COL },
            { cell: { row: 3, col: 1 }, mainNumber: 6, type: HIDDEN_SINGLE_TYPES.BLOCK },
            { cell: { row: 4, col: 4 }, mainNumber: 4, type: HIDDEN_SINGLE_TYPES.COL },
            { cell: { row: 4, col: 5 }, mainNumber: 7, type: HIDDEN_SINGLE_TYPES.BLOCK },
            { cell: { row: 4, col: 7 }, mainNumber: 6, type: HIDDEN_SINGLE_TYPES.COL },
            { cell: { row: 5, col: 1 }, mainNumber: 9, type: HIDDEN_SINGLE_TYPES.COL },
            { cell: { row: 5, col: 8 }, mainNumber: 3, type: HIDDEN_SINGLE_TYPES.COL },
            { cell: { row: 6, col: 8 }, mainNumber: 4, type: HIDDEN_SINGLE_TYPES.BLOCK },
            { cell: { row: 7, col: 2 }, mainNumber: 1, type: HIDDEN_SINGLE_TYPES.BLOCK },
            { cell: { row: 7, col: 6 }, mainNumber: 3, type: HIDDEN_SINGLE_TYPES.BLOCK },
        ]
        const expectedResult = {
            3: 8,
            8: 9,
            15: 6,
            20: 9,
            21: 6,
            27: 1,
            28: 6,
            40: 4,
            41: 7,
            43: 6,
            46: 9,
            53: 3,
            62: 4,
            65: 1,
            69: 3,
        }
        expect(generateSinglesMap(hiddenSingles)).toEqual(expectedResult)
    })

    test('will return empty object if no singles are present', () => {
        const nakedSingles = []
        const expectedResult = {}
        expect(generateSinglesMap(nakedSingles)).toEqual(expectedResult)
    })
})
