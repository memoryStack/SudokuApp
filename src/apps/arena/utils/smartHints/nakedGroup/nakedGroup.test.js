import { makeTestStore } from "../../../../../utils/testingBoilerplate/makeReduxStore"
import boardReducers, { boardActions } from "../../../store/reducers/board.reducers"
import { HOUSE_TYPE } from "../constants"
import {
    filterNakedGroupEligibleCellsInHouse,
    getNakedGroupRawData,
    getCellsVisibleNotesInstancesCount,
    selectedCellsMakeGroup,
    getAnotherSharedHouse,
    isHintRemovesNotesFromCells,
} from "./nakedGroup"
import { mainNumbers, notesData } from "./nakedGroup.testData"

const { setPossibleNotes } = boardActions

describe('getNakedGroupRawData()', () => {
    const store = makeTestStore({ board: boardReducers })
    store.dispatch(setPossibleNotes(notesData))
    test('returns selected cells of naked group in an array', () => {
        const expectedResult = [{ selectedCells: [{ row: 0, col: 2 }, { row: 0, col: 1 }] }]
        expect(getNakedGroupRawData(2, notesData, mainNumbers, 1)).toStrictEqual(expectedResult)
    })
})

describe('filterNakedGroupEligibleCellsInHouse()', () => {
    test('returns valid cells in first row for Naked Double', () => {
        const house = { type: HOUSE_TYPE.ROW, num: 0 }
        const expectedValidCells = [{ row: 0, col: 1 }, { row: 0, col: 2 }]
        const groupCandidatesCount = 2
        expect(filterNakedGroupEligibleCellsInHouse(house, groupCandidatesCount, mainNumbers, notesData)).toStrictEqual(expectedValidCells)
    })

    test('returns empty array if there are no valid cells in house', () => {
        const house = { type: HOUSE_TYPE.ROW, num: 2 }
        const groupCandidatesCount = 2
        expect(filterNakedGroupEligibleCellsInHouse(house, groupCandidatesCount, mainNumbers, notesData)).toStrictEqual([])
    })
})

describe('getCellsVisibleNotesInstancesCount()', () => {
    test('returns map of note with its instances count in row cells', () => {
        const cells = [{ row: 0, col: 1 }, { row: 3, col: 1 }]
        const expectedResult = { '5': 1, '4': 1, '8': 2, }
        expect(getCellsVisibleNotesInstancesCount(cells, notesData)).toStrictEqual(expectedResult)
    })

    test('returns map of note with its instances count in block cells', () => {
        const cells = [{ row: 5, col: 3 }, { row: 3, col: 4 }]
        const expectedResult = { '2': 1, '4': 2, '5': 1, '6': 1, '8': 2, '9': 1 }
        expect(getCellsVisibleNotesInstancesCount(cells, notesData)).toStrictEqual(expectedResult)
    })

    test('returns empty object if there are no notes in any cell', () => {
        const cells = [{ row: 0, col: 3 }, { row: 0, col: 4 }]
        expect(getCellsVisibleNotesInstancesCount(cells, notesData)).toStrictEqual({})
    })
})

describe('selectedCellsMakeGroup()', () => {
    test('returns true when passed cells have Naked Group', () => {
        const cells = [{ row: 1, col: 8 }, { row: 2, col: 8 }, { row: 2, col: 7 }]
        expect(selectedCellsMakeGroup(cells, notesData, 3)).toBeTruthy()
    })

    test('returns false when passed cells doesnt have Naked Group', () => {
        const cells = [{ row: 7, col: 4 }, { row: 7, col: 5 }, { row: 8, col: 5 }]
        expect(selectedCellsMakeGroup(cells, notesData, 3)).toBeFalsy()
    })
})

describe('getAnotherSharedHouse()', () => {
    test('return block house when row cells also happen to be in same block', () => {
        const cells = [{ row: 1, col: 1 }, { row: 1, col: 2 }]
        const mainHouse = { type: HOUSE_TYPE.ROW, num: 1 }
        const expectedResult = { type: HOUSE_TYPE.BLOCK, num: 0 }
        expect(getAnotherSharedHouse(mainHouse, cells)).toStrictEqual(expectedResult)
    })

    test('return column house when block cells also happen to be in same column', () => {
        const cells = [{ row: 4, col: 5 }, { row: 5, col: 5 }]
        const mainHouse = { type: HOUSE_TYPE.BLOCK, num: 4 }
        const expectedResult = { type: HOUSE_TYPE.COL, num: 5 }
        expect(getAnotherSharedHouse(mainHouse, cells)).toStrictEqual(expectedResult)
    })

    test('return null when cells have only one common house', () => {
        const cells = [{ row: 4, col: 5 }, { row: 4, col: 6 }]
        const mainHouse = { type: HOUSE_TYPE.ROW, num: 4 }
        expect(getAnotherSharedHouse(mainHouse, cells)).toBeNull()
    })
})

describe('isHintRemovesNotesFromCells()', () => {
    test('returns true when Valid Naked Group removes some notes in house', () => {
        const cells = [{ row: 0, col: 1 }, { row: 0, col: 2 }]
        expect(isHintRemovesNotesFromCells(cells, notesData)).toBeTruthy()
    })

    test('returns true when Valid Naked Group doesnt removes notes in house', () => {
        const cells = [{ row: 1, col: 8 }, { row: 2, col: 8 }, { row: 2, col: 7 }]
        expect(isHintRemovesNotesFromCells(cells, notesData)).toBeFalsy()
    })
})
