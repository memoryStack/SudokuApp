import { HIDDEN_SINGLE_TYPES } from '../constants'
import { getAllHiddenSingles } from './hiddenSingle'

test('hidden singles', () => {
    const { mainNumbers, notesData } = require('./testData')
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
    expect(getAllHiddenSingles(mainNumbers, notesData)).toStrictEqual(hiddenSingles)
})
