import { makeTestStore } from "../../../../../utils/testingBoilerplate/makeReduxStore"
import boardReducers, { boardActions } from "../../../store/reducers/board.reducers"
import { highlightNakedDoublesOrTriples } from "./nakedGroup"
import { mainNumbers, notesData } from "./nakedGroup.testData"

const { setPossibleNotes } = boardActions

const fullHintData = [
    {
        hasTryOut: true,
        focusedCells: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
            { row: 0, col: 5 },
            { row: 0, col: 6 },
            { row: 0, col: 7 },
            { row: 0, col: 8 }
        ],
        cellsToFocusData: {
            0: {
                0: {
                    bgColor: { backgroundColor: "white" }
                },
                1: {
                    bgColor: { backgroundColor: "white" },
                    notesToHighlightData: {
                        5: { fontColor: "green" },
                        8: { fontColor: "green" }
                    }
                },
                2: {
                    bgColor: { backgroundColor: "white" },
                    notesToHighlightData: {
                        5: { fontColor: "green" },
                        8: { fontColor: "green" }
                    }
                },
                3: {
                    bgColor: { backgroundColor: "white" }
                },
                4: {
                    bgColor: { backgroundColor: "white" }
                },
                5: {
                    bgColor: { backgroundColor: "white" }
                },
                6: {
                    bgColor: { backgroundColor: "white" }
                },
                7: {
                    bgColor: { backgroundColor: "white" }
                },
                8: {
                    bgColor: { backgroundColor: "white" }
                }
            },
            1: {
                0: {
                    bgColor: { backgroundColor: "white" }
                },
                1: {
                    bgColor: { backgroundColor: "white" },
                    notesToHighlightData: {
                        5: {
                            fontColor: "red"
                        }
                    }
                },
                2: {
                    bgColor: {
                        backgroundColor: "white"
                    }
                }
            },
            2: {
                0: {
                    bgColor: {
                        backgroundColor: "white"
                    }
                },
                1: {
                    bgColor: {
                        backgroundColor: "white"
                    }
                },
                2: {
                    bgColor: {
                        backgroundColor: "white"
                    },
                    notesToHighlightData: {
                        5: {
                            fontColor: "red"
                        },
                        8: {
                            fontColor: "red"
                        }
                    }
                }
            }
        },
        type: "NAKED_DOUBLE",
        title: "Naked Double",
        tryOutAnalyserData: {
            groupCandidates: [
                5,
                8
            ],
            focusedCells: [
                {
                    row: 0,
                    col: 0
                },
                {
                    row: 0,
                    col: 1
                },
                {
                    row: 0,
                    col: 2
                },
                {
                    row: 1,
                    col: 0
                },
                {
                    row: 1,
                    col: 1
                },
                {
                    row: 1,
                    col: 2
                },
                {
                    row: 2,
                    col: 0
                },
                {
                    row: 2,
                    col: 1
                },
                {
                    row: 2,
                    col: 2
                },
                {
                    row: 0,
                    col: 3
                },
                {
                    row: 0,
                    col: 4
                },
                {
                    row: 0,
                    col: 5
                },
                {
                    row: 0,
                    col: 6
                },
                {
                    row: 0,
                    col: 7
                },
                {
                    row: 0,
                    col: 8
                }
            ],
            groupCells: [
                {
                    row: 0,
                    col: 2
                },
                {
                    row: 0,
                    col: 1
                }
            ]
        },
        inputPanelNumbersVisibility: [false, false, false, false, false, true, false, false, true, false],
        steps: [
            { text: "A Naked Double is a set of two candidates filled in two cells that are part of same row, column or box.\nNote: these two cells can't have more than 2 different set of candidates" },
            { text: "5 and 8 make a naked double in the highlighted region. in the solution 5 and 8 will be placed in Naked Double cells only and all the candidates of 5 and 8 can be removed from other cells of the highlighted region. 5 and 8 will go in exactly which Naked Double cell is yet not clear." },
            { isTryOut: true, text: "try out" }
        ]
    }
]

describe('highlightNakedDoublesOrTriples()', () => {
    test('', () => {
        const store = makeTestStore({ board: boardReducers })
        store.dispatch(setPossibleNotes(notesData))

        expect(highlightNakedDoublesOrTriples(2, notesData, mainNumbers, 1)).toStrictEqual(fullHintData)
    })
})
