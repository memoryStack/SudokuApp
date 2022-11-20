import { makeTestStore } from "../../../../../utils/testingBoilerplate/makeReduxStore"
import boardReducers, { boardActions } from "../../../store/reducers/board.reducers"
import { HOUSE_TYPE } from "../constants"
import { filterNakedGroupEligibleCellsInHouse, getNakedGroupRawData } from "./nakedGroup"
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
