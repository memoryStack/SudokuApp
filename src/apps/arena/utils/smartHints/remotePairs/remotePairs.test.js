import { mainNumbers, notes, possibleNotes } from './testData'

import {
    getAllValidCellsWithPairs,
    getHostCellsForEachNotesPair,
    deleteInvalidNotesPairsKeys,
    getRemotePairsRawHints,
    isValidChainOfCells,
    getEachCellCommonHousesCells,
    isChainPossibleWithAllCells,
    getOrderedChainCells,
    validChainRemovesNotes,
    isChainRemovesNotesInCell,
    getCellsWithNotesToBeRemoved,
} from './remotePairs'

jest.mock('../../../../../redux/dispatch.helpers')
jest.mock('../../../store/selectors/board.selectors')

const mockBoardSelectors = () => {
    const { getPossibleNotes } = require('../../../store/selectors/board.selectors')
    const { getStoreState } = require('../../../../../redux/dispatch.helpers')
    getPossibleNotes.mockReturnValue(possibleNotes)
    getStoreState.mockReturnValue({})
}

// TODO: fix these linting errors for test files
describe('getAllValidCellsWithPairs()', () => {
    mockBoardSelectors()
    test('returns all the cells which have only 2 notes in them', () => {
        const expectedResult = [
            { row: 0, col: 0 },
            { row: 0, col: 7 },
            { row: 1, col: 2 },
            { row: 1, col: 4 },
            { row: 2, col: 3 },
            { row: 2, col: 8 },
            { row: 3, col: 4 },
            { row: 3, col: 6 },
            { row: 4, col: 0 },
            { row: 4, col: 8 },
            { row: 5, col: 2 },
            { row: 5, col: 3 },
        ]
        expect(getAllValidCellsWithPairs(mainNumbers, notes)).toStrictEqual(expectedResult)
    })
})

describe('getHostCellsForEachNotesPair()', () => {
    test('returns all host cells for each set of notes pair', () => {
        const cellsWithPairs = [
            { row: 0, col: 0 },
            { row: 0, col: 7 },
            { row: 1, col: 2 },
            { row: 1, col: 4 },
            { row: 2, col: 3 },
            { row: 2, col: 8 },
            { row: 3, col: 4 },
            { row: 3, col: 6 },
            { row: 4, col: 0 },
            { row: 4, col: 8 },
            { row: 5, col: 2 },
            { row: 5, col: 3 },
        ]
        const expectedResult = {
            57: [{ row: 0, col: 0 }],
            17: [
                { row: 0, col: 7 },
                { row: 1, col: 4 },
                { row: 3, col: 4 },
                { row: 5, col: 2 },
                { row: 5, col: 3 },
            ],
            67: [{ row: 2, col: 3 }],
            69: [{ row: 2, col: 8 }],
            37: [
                { row: 1, col: 2 },
                { row: 3, col: 6 },
                { row: 4, col: 0 },
            ],
            19: [{ row: 4, col: 8 }],
        }
        expect(getHostCellsForEachNotesPair(cellsWithPairs, notes)).toStrictEqual(expectedResult)
    })
})

describe('deleteInvalidNotesPairsKeys()', () => {
    test('deletes notes pairs keys which has less than 4 host cells', () => {
        const notesPairHostCells = {
            57: [{ row: 0, col: 0 }],
            17: [
                { row: 0, col: 7 },
                { row: 1, col: 4 },
                { row: 3, col: 4 },
                { row: 5, col: 2 },
                { row: 5, col: 3 },
            ],
            67: [{ row: 2, col: 3 }],
            69: [{ row: 2, col: 8 }],
            37: [
                { row: 1, col: 2 },
                { row: 3, col: 6 },
                { row: 4, col: 0 },
            ],
            19: [{ row: 4, col: 8 }],
        }
        const expectedResult = {
            17: [
                { row: 0, col: 7 },
                { row: 1, col: 4 },
                { row: 3, col: 4 },
                { row: 5, col: 2 },
                { row: 5, col: 3 },
            ],
        }
        deleteInvalidNotesPairsKeys(notesPairHostCells)
        expect(notesPairHostCells).toStrictEqual(expectedResult)
    })
})

describe('getRemotePairsRawHints()', () => {
    test('returns raw details of a remote pair chain', () => {
        const expectedResult = {
            remotePairNotes: [1, 7],
            orderedChainCells: [{ row: 1, col: 4 }, { row: 3, col: 4 }, { row: 5, col: 3 }, { row: 5, col: 2 }],
            removableNotesHostCells: [{ row: 1, col: 2 }],
        }
        expect(getRemotePairsRawHints(mainNumbers, notes)).toStrictEqual(expectedResult)
    })
})

describe('isValidChainOfCells()', () => {
    /*
        a valid chain is when 2 cells have only 1 cell in their common house in the list and
        rest of cells will have only two cells in their common house
    */
    test('returns false when there are not sufficient end points', () => {
        const cells = [
            { row: 0, col: 0 },
            { row: 2, col: 2 },
            { row: 5, col: 2 },
            { row: 4, col: 0 },
        ]
        expect(isValidChainOfCells(cells)).toBeFalsy()
    })

    test('returns false when chain is not possible by including all cells', () => {
        const cells = [
            { row: 2, col: 5 },
            { row: 4, col: 4 },
            { row: 5, col: 5 },
            { row: 1, col: 4 },
            { row: 8, col: 2 },
            { row: 6, col: 0 },
        ]
        expect(isValidChainOfCells(cells)).toBeFalsy()
    })

    test('returns true when all cells in chain are valid and also the chain will include all cells when we traverse from one end point', () => {
        const cells = [
            { row: 0, col: 0 },
            { row: 2, col: 2 },
            { row: 5, col: 2 },
            { row: 5, col: 4 },
        ]
        expect(isValidChainOfCells(cells)).toBeTruthy()
    })
})

describe('isChainPossibleWithAllCells()', () => {
    test('takes a valid set of cells which are passed by areValidSetOfCellsInCommonHouses() and returns true if a chain is possible which joins all these cells', () => {
        const eachCellCommonHousesCells = {
            0: [{ row: 2, col: 2 }],
            20: [{ row: 0, col: 0 }, { row: 5, col: 2 }],
            46: [{ row: 5, col: 2 }],
            47: [{ row: 2, col: 2 }, { row: 5, col: 1 }],
        }
        expect(isChainPossibleWithAllCells(eachCellCommonHousesCells)).toBeTruthy()
    })

    test('returns false when a complete chain is not possible', () => {
        const eachCellCommonHousesCells = {
            13: [{ row: 2, col: 5 }, { row: 4, col: 4 }],
            23: [{ row: 1, col: 4 }, { row: 5, col: 5 }],
            40: [{ row: 1, col: 4 }, { row: 5, col: 5 }],
            50: [{ row: 2, col: 5 }, { row: 4, col: 4 }],
            54: [{ row: 8, col: 2 }],
            74: [{ row: 6, col: 0 }],
        }
        expect(isChainPossibleWithAllCells(eachCellCommonHousesCells)).toBeFalsy()
    })
})

// TODO: add more test-cases to it
describe('validChainRemovesNotes()', () => {
    test('checks if valid chain of remote pairs removes notes in some cells or not', () => {
        const notesPair = [1, 7]
        const chainCells = [
            { row: 1, col: 4 },
            { row: 5, col: 2 },
            { row: 3, col: 4 },
            { row: 5, col: 3 },
        ]
        expect(validChainRemovesNotes(chainCells, notesPair, notes)).toBeTruthy()
    })
})

describe('getCellsWithNotesToBeRemoved()', () => {
    test('returns all the cells from which notes will be removed', () => {
        const remoteNotesPair = [1, 7]
        const validChainCells = [
            { row: 1, col: 4 },
            { row: 5, col: 2 },
            { row: 3, col: 4 },
            { row: 5, col: 3 },
        ]
        const expectedResult = [{ row: 1, col: 2 }]
        expect(getCellsWithNotesToBeRemoved(validChainCells, remoteNotesPair, notes)).toStrictEqual(expectedResult)
    })
})

describe('isChainRemovesNotesInCell()', () => {
    // TODO: check if can a cell share house with 3 cells ??
    // when sharing house with more then 2 cells, then notes will be removed by naked double only
    // but let's keep it as an improvement for future and for now just keep it limited to two cells only
    test('returns false when cell shares house with only 1 cell in the chain', () => {
        const cell = { row: 3, col: 6 }
        const chainCells = [
            { row: 1, col: 4 },
            { row: 3, col: 4 },
            { row: 5, col: 3 },
            { row: 5, col: 2 },
        ]
        expect(isChainRemovesNotesInCell(cell, chainCells)).toBeFalsy()
    })

    test('returns false when cell shares house with two cells in chain but both chain cells will have same number in them', () => {
        const cell = { row: 3, col: 2 }
        const chainCells = [
            { row: 1, col: 4 },
            { row: 3, col: 4 },
            { row: 5, col: 3 },
            { row: 5, col: 2 },
        ]
        expect(isChainRemovesNotesInCell(cell, chainCells)).toBeFalsy()
    })

    test('returns true when both chain cells will have different numbers in them always', () => {
        const cell = { row: 1, col: 2 }
        const chainCells = [
            { row: 1, col: 4 },
            { row: 3, col: 4 },
            { row: 5, col: 3 },
            { row: 5, col: 2 },
        ]
        expect(isChainRemovesNotesInCell(cell, chainCells)).toBeTruthy()
    })
})

describe('getEachCellCommonHousesCells()', () => {
    test('returns an object where cell number is key and value will be the array of cells which shares any house with the cell', () => {
        const cells = [{ row: 0, col: 0 }, { row: 2, col: 2 }, { row: 5, col: 2 }, { row: 4, col: 0 }]
        const expectedResult = {
            0: [{ row: 2, col: 2 }, { row: 4, col: 0 }],
            20: [{ row: 0, col: 0 }, { row: 5, col: 2 }],
            47: [{ row: 2, col: 2 }, { row: 4, col: 0 }],
            36: [{ row: 0, col: 0 }, { row: 5, col: 2 }],
        }
        expect(getEachCellCommonHousesCells(cells)).toStrictEqual(expectedResult)
    })
})

describe('getOrderedChainCells()', () => {
    test('returns chain cells in which it will be traversed from one endpoint to another', () => {
        const unOrderedChainCells = [
            { row: 0, col: 0 },
            { row: 5, col: 2 },
            { row: 2, col: 2 },
            { row: 5, col: 4 },
        ]
        const orderedCells = [
            { row: 0, col: 0 },
            { row: 2, col: 2 },
            { row: 5, col: 2 },
            { row: 5, col: 4 },
        ]
        expect(getOrderedChainCells(unOrderedChainCells)).toStrictEqual(orderedCells)
    })
})
