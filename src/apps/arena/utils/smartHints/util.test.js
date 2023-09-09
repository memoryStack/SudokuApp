import {
    getCellsFromCellsToFocusedData,
    setCellDataInHintResult,
    setCellNotesHighlightDataInHintResult,
    getCandidatesListText,
    removeDuplicteCells,
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
