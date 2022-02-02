import { getHiddenSingleTechniqueInfo } from '../../smartHint'
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

test('hidden singles hints UI text', () => {
    const { mainNumbers, notesData } = require('./testData')
    const hiddenSinglesHintsUIData = getAllHiddenSingles(mainNumbers, notesData).map(({ cell, type }) => {
        return getHiddenSingleTechniqueInfo(cell, type, mainNumbers)
    })
    expect(hiddenSinglesHintsUIData).toStrictEqual(HIDDEN_SINGLE_UI_DATA)
})

const HIDDEN_SINGLE_UI_DATA = [
    {
        cellsToFocusData: {
            0: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                2: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                3: {
                    bgColor: {
                        backgroundColor: 'rgb(255, 245, 187)',
                    },
                },
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                5: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                6: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                8: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
            },
            4: {
                8: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            5: {
                5: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            8: {
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
        },
        techniqueInfo: {
            title: 'Hidden Single',
            logic: "in the highlighted row, 8 can't appear in crossed cells due to the highlighted instances of same number. So it has only one place where it can come",
        },
        selectCellOnClose: {
            row: 0,
            col: 3,
        },
    },
    {
        cellsToFocusData: {
            0: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                2: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                3: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                5: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                6: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                8: {
                    bgColor: {
                        backgroundColor: 'rgb(255, 245, 187)',
                    },
                },
            },
            1: {
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            3: {
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
        },
        techniqueInfo: {
            title: 'Hidden Single',
            logic: "in the highlighted row, 9 can't appear in crossed cells due to the highlighted instances of same number. So it has only one place where it can come",
        },
        selectCellOnClose: {
            row: 0,
            col: 8,
        },
    },
    {
        cellsToFocusData: {
            0: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            1: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                2: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                3: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                5: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                6: {
                    bgColor: {
                        backgroundColor: 'rgb(255, 245, 187)',
                    },
                },
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                8: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
            },
            7: {
                8: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            8: {
                5: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
        },
        techniqueInfo: {
            title: 'Hidden Single',
            logic: "in the highlighted row, 6 can't appear in crossed cells due to the highlighted instances of same number. So it has only one place where it can come",
        },
        selectCellOnClose: {
            row: 1,
            col: 6,
        },
    },
    {
        cellsToFocusData: {
            0: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                2: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            1: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                2: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            2: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                2: {
                    bgColor: {
                        backgroundColor: 'rgb(255, 245, 187)',
                    },
                },
            },
            8: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
        },
        techniqueInfo: {
            title: 'Hidden Single',
            logic: "in the highlighted block, 9 can't appear in crossed cells due to the highlighted instances of same number. So it has only one place where it can come",
        },
        selectCellOnClose: {
            row: 2,
            col: 2,
        },
    },
    {
        cellsToFocusData: {
            0: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                3: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                5: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
            },
            1: {
                3: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                5: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
            },
            2: {
                3: {
                    bgColor: {
                        backgroundColor: 'rgb(255, 245, 187)',
                    },
                },
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                5: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            5: {
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            8: {
                5: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
        },
        techniqueInfo: {
            title: 'Hidden Single',
            logic: "in the highlighted block, 6 can't appear in crossed cells due to the highlighted instances of same number. So it has only one place where it can come",
        },
        selectCellOnClose: {
            row: 2,
            col: 3,
        },
    },
    {
        cellsToFocusData: {
            0: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            1: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
            },
            2: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
            },
            3: {
                0: {
                    bgColor: {
                        backgroundColor: 'rgb(255, 245, 187)',
                    },
                },
            },
            4: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            5: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            6: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            7: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            8: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
        },
        techniqueInfo: {
            title: 'Hidden Single',
            logic: "in the highlighted col, 1 can't appear in crossed cells due to the highlighted instances of same number. So it has only one place where it can come",
        },
        selectCellOnClose: {
            row: 3,
            col: 0,
        },
    },
    {
        cellsToFocusData: {
            0: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            3: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                1: {
                    bgColor: {
                        backgroundColor: 'rgb(255, 245, 187)',
                    },
                },
                2: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
            },
            4: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                2: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
            },
            5: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                2: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            6: {
                2: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
        },
        techniqueInfo: {
            title: 'Hidden Single',
            logic: "in the highlighted block, 6 can't appear in crossed cells due to the highlighted instances of same number. So it has only one place where it can come",
        },
        selectCellOnClose: {
            row: 3,
            col: 1,
        },
    },
    {
        cellsToFocusData: {
            0: {
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            1: {
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            2: {
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
            },
            3: {
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            4: {
                4: {
                    bgColor: {
                        backgroundColor: 'rgb(255, 245, 187)',
                    },
                },
            },
            5: {
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            6: {
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            7: {
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            8: {
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
        },
        techniqueInfo: {
            title: 'Hidden Single',
            logic: "in the highlighted col, 4 can't appear in crossed cells due to the highlighted instances of same number. So it has only one place where it can come",
        },
        selectCellOnClose: {
            row: 4,
            col: 4,
        },
    },
    {
        cellsToFocusData: {
            1: {
                3: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            3: {
                3: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                5: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            4: {
                3: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                5: {
                    bgColor: {
                        backgroundColor: 'rgb(255, 245, 187)',
                    },
                },
            },
            5: {
                3: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                5: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            7: {
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
        },
        techniqueInfo: {
            title: 'Hidden Single',
            logic: "in the highlighted block, 7 can't appear in crossed cells due to the highlighted instances of same number. So it has only one place where it can come",
        },
        selectCellOnClose: {
            row: 4,
            col: 5,
        },
    },
    {
        cellsToFocusData: {
            0: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
            },
            1: {
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            2: {
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            3: {
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            4: {
                7: {
                    bgColor: {
                        backgroundColor: 'rgb(255, 245, 187)',
                    },
                },
            },
            5: {
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
            },
            6: {
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            7: {
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                8: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            8: {
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
        },
        techniqueInfo: {
            title: 'Hidden Single',
            logic: "in the highlighted col, 6 can't appear in crossed cells due to the highlighted instances of same number. So it has only one place where it can come",
        },
        selectCellOnClose: {
            row: 4,
            col: 7,
        },
    },
    {
        cellsToFocusData: {
            0: {
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            1: {
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                4: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            2: {
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            3: {
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            4: {
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            5: {
                1: {
                    bgColor: {
                        backgroundColor: 'rgb(255, 245, 187)',
                    },
                },
            },
            6: {
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
            },
            7: {
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
            },
            8: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
        },
        techniqueInfo: {
            title: 'Hidden Single',
            logic: "in the highlighted col, 9 can't appear in crossed cells due to the highlighted instances of same number. So it has only one place where it can come",
        },
        selectCellOnClose: {
            row: 5,
            col: 1,
        },
    },
    {
        cellsToFocusData: {
            0: {
                8: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
            },
            1: {
                8: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
            },
            2: {
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                8: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
            },
            3: {
                5: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                8: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
            },
            4: {
                8: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            5: {
                8: {
                    bgColor: {
                        backgroundColor: 'rgb(255, 245, 187)',
                    },
                },
            },
            6: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                8: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
            },
            7: {
                8: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            8: {
                8: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
        },
        techniqueInfo: {
            title: 'Hidden Single',
            logic: "in the highlighted col, 3 can't appear in crossed cells due to the highlighted instances of same number. So it has only one place where it can come",
        },
        selectCellOnClose: {
            row: 5,
            col: 8,
        },
    },
    {
        cellsToFocusData: {
            6: {
                6: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                8: {
                    bgColor: {
                        backgroundColor: 'rgb(255, 245, 187)',
                    },
                },
            },
            7: {
                3: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                6: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                8: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            8: {
                6: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                8: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
        },
        techniqueInfo: {
            title: 'Hidden Single',
            logic: "in the highlighted block, 4 can't appear in crossed cells due to the highlighted instances of same number. So it has only one place where it can come",
        },
        selectCellOnClose: {
            row: 6,
            col: 8,
        },
    },
    {
        cellsToFocusData: {
            0: {
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            6: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                2: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            7: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                2: {
                    bgColor: {
                        backgroundColor: 'rgb(255, 245, 187)',
                    },
                },
            },
            8: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                1: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                2: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
        },
        techniqueInfo: {
            title: 'Hidden Single',
            logic: "in the highlighted block, 1 can't appear in crossed cells due to the highlighted instances of same number. So it has only one place where it can come",
        },
        selectCellOnClose: {
            row: 7,
            col: 2,
        },
    },
    {
        cellsToFocusData: {
            2: {
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            6: {
                0: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                6: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                8: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
            },
            7: {
                6: {
                    bgColor: {
                        backgroundColor: 'rgb(255, 245, 187)',
                    },
                },
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                    inhabitable: true,
                },
                8: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
            8: {
                6: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                7: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
                8: {
                    bgColor: {
                        backgroundColor: 'white',
                    },
                },
            },
        },
        techniqueInfo: {
            title: 'Hidden Single',
            logic: "in the highlighted block, 3 can't appear in crossed cells due to the highlighted instances of same number. So it has only one place where it can come",
        },
        selectCellOnClose: {
            row: 7,
            col: 6,
        },
    },
]
