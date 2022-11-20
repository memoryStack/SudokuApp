import { makeTestStore } from "../../../../../utils/testingBoilerplate/makeReduxStore"
import boardReducers, { boardActions } from "../../../store/reducers/board.reducers"
import { HOUSE_TYPE } from "../constants"
import {
    filterNakedGroupEligibleCellsInHouse,
    getNakedGroupRawData,
    getCellsVisibleNotesInstancesCount,
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
