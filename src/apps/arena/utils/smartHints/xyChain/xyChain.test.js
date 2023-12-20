import { getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'
import { LINK_TYPES } from '../xChain/xChain.constants'
import {
    generateLinkBetweenCells,
    getAllValidCellsWithPairs,
    getNotesVSHostCellsMap,
    getNewLinksOptions,
    getRawXYChainHints,
    chainTerminalsRemoveNotes,
    onAddingNewNodeInChain,
    getPreferredChainFromValidChains,
    getValidXYChainFromCells,
} from './xyChain'

describe('getAllValidCellsWithPairs()', () => {
    const puzzle = '361749528584000790792000004923574080416000357857631249678000412145287900239416875'
    const { mainNumbers, notes, possibleNotes } = getPuzzleDataFromPuzzleString(puzzle)

    test('returns all the cells which have only 2 notes in them', () => {
        const expectedResult = [
            { row: 1, col: 3 },
            { row: 1, col: 4 },
            { row: 1, col: 5 },
            { row: 2, col: 4 },
            { row: 2, col: 6 },
            { row: 2, col: 7 },
            { row: 3, col: 6 },
            { row: 3, col: 8 },
            { row: 4, col: 3 },
            { row: 4, col: 4 },
            { row: 4, col: 5 },
            { row: 6, col: 3 },
            { row: 6, col: 4 },
            { row: 6, col: 5 },
            { row: 7, col: 7 },
            { row: 7, col: 8 },
        ]

        expect(getAllValidCellsWithPairs(mainNumbers, notes, possibleNotes)).toStrictEqual(expectedResult)
    })
})

describe('getNotesVSHostCellsMap()', () => {
    const puzzle = '361749528584000790792000004923574080416000357857631249678000412145287900239416875'
    const { notes } = getPuzzleDataFromPuzzleString(puzzle)

    test('returns a map of notes present in passed cells and their host cells', () => {
        const cells = [
            { row: 1, col: 3 },
            { row: 1, col: 4 },
            { row: 1, col: 5 },
            { row: 2, col: 4 },
            { row: 2, col: 6 },
            { row: 2, col: 7 },
            { row: 3, col: 6 },
            { row: 3, col: 8 },
            { row: 4, col: 3 },
            { row: 4, col: 4 },
            { row: 4, col: 5 },
            { row: 6, col: 3 },
            { row: 6, col: 4 },
            { row: 6, col: 5 },
            { row: 7, col: 7 },
            { row: 7, col: 8 },
        ]

        const expectedResult = {
            1: [12, 24, 33, 35],
            2: [13, 14, 40, 41],
            3: [12, 14, 25, 57, 59, 70, 71],
            5: [22, 58, 59],
            6: [13, 22, 24, 25, 33, 35, 70, 71],
            8: [39, 41],
            9: [39, 40, 57, 58],
        }

        expect(getNotesVSHostCellsMap(cells, notes)).toStrictEqual(expectedResult)
    })
})

describe('generateLinkBetweenCells()', () => {
    test('will generate weak links between cells', () => {
        const puzzle = '361749528584000790792000004923574080416000357857631249678000412145287900239416875'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)
        const cells = [
            { row: 1, col: 3 },
            { row: 1, col: 4 },
            { row: 1, col: 5 },
            { row: 2, col: 4 },
            { row: 2, col: 6 },
            { row: 2, col: 7 },
        ]

        const expectedResult = {
            12: {
                3: [14],
            },
            13: {
                2: [14],
                6: [22],
            },
            14: {
                2: [13],
                3: [12],
            },
            22: {
                6: [13, 24, 25],
            },
            24: {
                6: [22, 25],
            },
            25: {
                6: [22, 24],
            },
        }

        expect(generateLinkBetweenCells(cells, notes)).toEqual(expectedResult)
    })
})

describe('getNewLinksOptions()', () => {
    // TODO: write a test-case for which we get no options at all if end cell is sink cell
    test('returns the new links to explore from the given state of chain', () => {
        const links = {
            12: {
                3: [14],
            },
            13: {
                2: [14],
                6: [22],
            },
            14: {
                2: [13],
                3: [12],
            },
            22: {
                6: [13, 24, 25],
            },
            24: {
                6: [22, 25],
            },
            25: {
                6: [22, 24],
            },
        }
        const numbersFilledInChainCells = {
            14: { filledNumber: 2, parent: -1 },
            13: { filledNumber: 6, parent: 14 },
            lastNode: 13,
        }
        // these links details have some implementation details in them
        const chain = [
            {
                start: 14, end: 14, type: LINK_TYPES.STRONG, isTerminal: false,
            },
            {
                start: 14, end: 13, type: LINK_TYPES.STRONG, isTerminal: false,
            },
        ]
        // hint of implementation detail
        const newLinksFinder = getNewLinksOptions(links, numbersFilledInChainCells, 14, 59)

        const expectedResult = { newLinkPossibleCells: [{ node: 22, type: LINK_TYPES.WEAK }] }
        expect(newLinksFinder(chain)).toEqual(expectedResult)
    })

    test('returns empty list if no new links can be found to progress chain from end terminal', () => {
        const links = {
            12: { 3: [14, 57] },
            13: { 2: [14, 40], 6: [22] },
            14: { 2: [13, 41], 3: [12, 59] },
            22: { 5: [58], 6: [13, 24, 25] },
            24: { 1: [33], 6: [22, 25, 33] },
            25: { 3: [70], 6: [22, 24, 70] },
            33: { 1: [24, 35], 6: [24, 35] },
            35: { 1: [33], 6: [33, 71] },
            39: { 8: [41], 9: [40, 57] },
            40: { 2: [13, 41], 9: [39, 58] },
            41: { 2: [14, 40], 8: [39] },
            57: { 3: [12, 59], 9: [39, 58] },
            58: { 5: [22, 59], 9: [40, 57] },
            59: { 3: [14, 57], 5: [58] },
            70: { 3: [25, 71], 6: [25, 71] },
            71: { 3: [70], 6: [35, 70] },
        }
        const numbersFilledInChainCells = { 12: { filledNumber: 1, parent: -1 }, lastNode: 12 }
        const chain = [{
            start: 12, end: 12, type: LINK_TYPES.STRONG, isTerminal: false,
        }]
        const newLinksFinder = getNewLinksOptions(links, numbersFilledInChainCells, 12, 24)
        const expectedResult = { newLinkPossibleCells: [] }
        expect(newLinksFinder(chain)).toEqual(expectedResult)
    })
})

describe('getRawXYChainHints()', () => {
    test('get the first valid XY-Chain from the group of bivalue cells', () => {
        const puzzle = '361749528584000790792000004923574080416000357857631249678000412145287900239416875'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)

        const cells = [
            { row: 1, col: 3 },
            { row: 1, col: 4 },
            { row: 1, col: 5 },
            { row: 2, col: 4 },
            { row: 2, col: 6 },
            { row: 2, col: 7 },
            { row: 3, col: 6 },
            { row: 3, col: 8 },
            { row: 4, col: 3 },
            { row: 4, col: 4 },
            { row: 4, col: 5 },
            { row: 6, col: 3 },
            { row: 6, col: 4 },
            { row: 6, col: 5 },
            { row: 7, col: 7 },
            { row: 7, col: 8 },
        ]

        const expectedResult = {
            chain: [
                {
                    start: 12, end: 57, type: LINK_TYPES.WEAK, isTerminal: true,
                },
                {
                    start: 57, end: 58, type: LINK_TYPES.WEAK, isTerminal: false,
                },
                {
                    start: 58, end: 22, type: LINK_TYPES.WEAK, isTerminal: false,
                },
                {
                    start: 22, end: 24, type: LINK_TYPES.WEAK, isTerminal: true,
                },
            ],
            removableNotesHostCells: [{ row: 1, col: 8 }, { row: 2, col: 3 }],
        }

        expect(getValidXYChainFromCells(cells, notes)).toEqual(expectedResult)
    })
})

describe('chainTerminalsRemoveNotes()', () => {
    test('returns true if any cell is present which sees both terminals and also have the common note from terminals visible in it', () => {
        const puzzle = '361749528584000790792000004923574080416000357857631249678000412145287900239416875'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)

        expect(chainTerminalsRemoveNotes([{ row: 2, col: 4 }, { row: 2, col: 6 }], 6, notes)).toBe(true)
    })

    test('returns false if no cell is present which sees both terminals and also have the common note from terminals visible in it', () => {
        const puzzle = '361749528584000790792000004923574080416000357857631249678000412145287900239416875'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)

        expect(chainTerminalsRemoveNotes([{ row: 1, col: 4 }, { row: 2, col: 4 }], 6, notes)).toBe(false)
    })

    test('returns false if no cell is present which sees both terminals and also have the common note from terminals visible in it', () => {
        const puzzle = '361749528584000790792000004923574080416000357857631249678000412145287900239416875'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)

        expect(chainTerminalsRemoveNotes([{ row: 1, col: 5 }, { row: 6, col: 3 }], 3, notes)).toBe(true)
    })
})

describe('onAddingNewNodeInChain()', () => {
    test('update visitedCells and store numbers to be filled in the new cell after adding it to chain', () => {
        const puzzle = '361749528584000790792000004923574080416000357857631249678000412145287900239416875'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)
        const visitedCells = { 12: true }
        const numbersFilledInChainCells = { 12: { filledNumber: 3, parent: -1 }, lastNode: 12 }
        const addNodeInChainHandler = onAddingNewNodeInChain(visitedCells, numbersFilledInChainCells, notes)
        addNodeInChainHandler(14)

        expect(visitedCells).toEqual({ 12: true, 14: true })
        expect(numbersFilledInChainCells).toEqual({
            12: { filledNumber: 3, parent: -1 },
            14: { filledNumber: 2, parent: 12 },
            lastNode: 14,
        })
    })

    test('test case 2', () => {
        const puzzle = '361749528584000790792000004923574080416000357857631249678000412145287900239416875'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)
        const visitedCells = { 14: true }
        const numbersFilledInChainCells = { 14: { filledNumber: 2, parent: -1 }, lastNode: 14 }
        const addNodeInChainHandler = onAddingNewNodeInChain(visitedCells, numbersFilledInChainCells, notes)
        addNodeInChainHandler(41)

        expect(visitedCells).toEqual({ 14: true, 41: true })
        expect(numbersFilledInChainCells).toStrictEqual({
            14: { filledNumber: 2, parent: -1 },
            41: { filledNumber: 8, parent: 14 },
            lastNode: 41,
        })
    })
})

describe('getPreferredChainFromValidChains()', () => {
    test('returns shortest links chain', () => {
        const validChains = [
            {
                chain: [
                    {
                        start: 12, end: 57, type: 'WEAK', isTerminal: true,
                    },
                    {
                        start: 57, end: 39, type: 'WEAK', isTerminal: false,
                    },
                    {
                        start: 39, end: 41, type: 'WEAK', isTerminal: false,
                    },
                    {
                        start: 41, end: 40, type: 'WEAK', isTerminal: true,
                    },

                ],
                removableNotesHostCells: [{ row: 1, col: 8 }, { row: 2, col: 3 }],
            },
            {
                chain: [
                    {
                        start: 12, end: 57, type: 'WEAK', isTerminal: true,
                    },
                    {
                        start: 57, end: 58, type: 'WEAK', isTerminal: false,
                    },
                    {
                        start: 58, end: 22, type: 'WEAK', isTerminal: true,
                    },
                ],
                removableNotesHostCells: [{ row: 1, col: 8 }, { row: 2, col: 3 }],
            },
        ]

        const expectedResult = {
            chain: [
                {
                    start: 12, end: 57, type: 'WEAK', isTerminal: true,
                },
                {
                    start: 57, end: 58, type: 'WEAK', isTerminal: false,
                },
                {
                    start: 58, end: 22, type: 'WEAK', isTerminal: true,
                },
            ],
            removableNotesHostCells: [{ row: 1, col: 8 }, { row: 2, col: 3 }],
        }
        expect(getPreferredChainFromValidChains(validChains)).toEqual(expectedResult)
    })

    test('returns the chain which removes most notes if more than 1 chain are of shortest length', () => {
        const validChains = [
            {
                chain: [
                    {
                        start: 12, end: 57, type: 'WEAK', isTerminal: true,
                    },
                    {
                        start: 57, end: 39, type: 'WEAK', isTerminal: false,
                    },
                    {
                        start: 39, end: 41, type: 'WEAK', isTerminal: true,
                    },
                ],
                removableNotesHostCells: [{ row: 1, col: 8 }, { row: 2, col: 3 }],
            },
            {
                chain: [
                    {
                        start: 12, end: 57, type: 'WEAK', isTerminal: true,
                    },
                    {
                        start: 57, end: 58, type: 'WEAK', isTerminal: false,
                    },
                    {
                        start: 58, end: 22, type: 'WEAK', isTerminal: true,
                    },
                ],
                removableNotesHostCells: [{ row: 1, col: 8 }, { row: 2, col: 3 }, { row: 2, col: 8 }],
            },
        ]

        const expectedResult = {
            chain: [
                {
                    start: 12, end: 57, type: 'WEAK', isTerminal: true,
                },
                {
                    start: 57, end: 58, type: 'WEAK', isTerminal: false,
                },
                {
                    start: 58, end: 22, type: 'WEAK', isTerminal: true,
                },
            ],
            removableNotesHostCells: [{ row: 1, col: 8 }, { row: 2, col: 3 }, { row: 2, col: 8 }],
        }
        expect(getPreferredChainFromValidChains(validChains)).toEqual(expectedResult)
    })

    test('returns the first shortest chain in the list which removes maximum notes out of all chains of shortest length', () => {
        const validChains = [
            {
                chain: [
                    {
                        start: 12, end: 57, type: 'WEAK', isTerminal: true,
                    },
                    {
                        start: 57, end: 39, type: 'WEAK', isTerminal: false,
                    },
                    {
                        start: 39, end: 41, type: 'WEAK', isTerminal: true,
                    },
                ],
                removableNotesHostCells: [{ row: 1, col: 8 }, { row: 2, col: 3 }],
            },
            {
                chain: [
                    {
                        start: 12, end: 57, type: 'WEAK', isTerminal: true,
                    },
                    {
                        start: 57, end: 58, type: 'WEAK', isTerminal: false,
                    },
                    {
                        start: 58, end: 22, type: 'WEAK', isTerminal: true,
                    },
                ],
                removableNotesHostCells: [{ row: 1, col: 8 }, { row: 2, col: 3 }],
            },
        ]

        const expectedResult = {
            chain: [
                {
                    start: 12, end: 57, type: 'WEAK', isTerminal: true,
                },
                {
                    start: 57, end: 39, type: 'WEAK', isTerminal: false,
                },
                {
                    start: 39, end: 41, type: 'WEAK', isTerminal: true,
                },
            ],
            removableNotesHostCells: [{ row: 1, col: 8 }, { row: 2, col: 3 }],
        }
        expect(getPreferredChainFromValidChains(validChains)).toEqual(expectedResult)
    })
})
