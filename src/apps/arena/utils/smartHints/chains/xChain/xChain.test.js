import { generateCustomNotes, getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'
import { HOUSE_TYPE } from '../../constants'

import {
    getCandidateAllStrongLinks,
    getNoteWeakLinks,
    getRawXChainHints,
    getTrimWeakLinksFromEdges,
    analyzeChain,
    alternateChainLinks,
    getChosenChainFromValidSubChains,
    removeRedundantLinks,
    getAllValidSubChains,
    getStrongLinksList,
    linksPairsHaveSufficientCells,
    chainIsOmission,
} from './xChain'

/*
    more test puzzles for x-chain
        '000351780857629341100874002509162804681040200000008160718000020000010008060080017'
        '013700000200069403000300070390002860640030029025690341530006000104950032000003050'
        '405260791029175406167409205210056070570002160006741052641500027700624510052017648'
        '010068340800003000000097082950830427000700803008042016520374008000080204084020030'
        '082040903005069428904280006418352009007691840009874031803007164501000080706018390'
        '108209007300078021072010489003004000001027900000300000017092040630700208200036700'
        '820469001690137208100285000010823500002590180008710092000302010700641025201908034'
        '802003670000000050059000203905410060001608905068095000507000410080000090094700002'
        '081020000004008125920001800000082610406175208812360500057200086249806701008000902'
        '700100000014960000900008100583691004167425389492387561009510000040039610001000003'
        '008002317100804296000001050004317600010968030006245901050106000600003100281409063'
        '580900000703180500001005000826419753059873600307256090005600380008040265000508017'
        '007030905950000230432951678009306800000020000003105700075803092090500080308000500'
        '103204756052716003070050020310405209025139400940800315530600000700540600264001500'
        '510076009400509000000004580045000106201600004693040720024700000050900000300458012'
        '070600050069527013125300769096800500587236941001005080600050078910760005750003090'
*/

// TODO: write a test case for filtering out the notes, possibleNotes difference as well
describe('getCandidateAllStrongLinks()', () => {
    test('returns all the strong links for a candidate grouped by houses, returned DS will contain each strong link house info as keys and will contain in which cells that note is present', () => {
        const expectedResult = [
            [{ row: 0, col: 1 }, { row: 0, col: 8 }],
            [{ row: 3, col: 2 }, { row: 6, col: 2 }],
            [{ row: 1, col: 7 }, { row: 6, col: 7 }],
        ]

        const puzzle = '304520080006090000050070300000689023000734000063152700010960000009040060608217005'
        const { notes, possibleNotes } = getPuzzleDataFromPuzzleString(puzzle)
        expect(getCandidateAllStrongLinks(7, notes, possibleNotes)).toEqual(expectedResult)
    })

    test('returns empty array if no strong links are found for a note in any house', () => {
        const puzzle = '304520080006090000050070300000689023000734000063152700010960000009040060608217005'
        const { notes, possibleNotes } = getPuzzleDataFromPuzzleString(puzzle)
        expect(getCandidateAllStrongLinks(2, notes, possibleNotes)).toEqual([])
    })
})

describe('getStrongLinksList()', () => {
    test('@@@@', () => {
        const linksOlderFormat = {
            [HOUSE_TYPE.ROW]: {
                0: [{ row: 0, col: 1 }, { row: 0, col: 8 }],
            },
            [HOUSE_TYPE.COL]: {
                2: [{ row: 3, col: 2 }, { row: 6, col: 2 }],
                7: [{ row: 1, col: 7 }, { row: 6, col: 7 }],
            },
        }
        const expectedResult = [
            [{ row: 0, col: 1 }, { row: 0, col: 8 }],
            [{ row: 3, col: 2 }, { row: 6, col: 2 }],
            [{ row: 1, col: 7 }, { row: 6, col: 7 }],
        ]
        expect(getStrongLinksList(linksOlderFormat)).toEqual(expectedResult)
    })
})

describe('linksPairsHaveSufficientCells()', () => {
    test('returns true when links do not have any common cell in them', () => {
        const firstLink = [{ row: 0, col: 1 }, { row: 0, col: 8 }]
        const secondLink = [{ row: 6, col: 4 }, { row: 6, col: 7 }]
        expect(linksPairsHaveSufficientCells(firstLink, secondLink)).toBe(true)
    })

    test('returns false when links have any common cell in them', () => {
        const firstLink = [{ row: 0, col: 1 }, { row: 0, col: 8 }]
        const secondLink = [{ row: 0, col: 8 }, { row: 6, col: 8 }]
        expect(linksPairsHaveSufficientCells(firstLink, secondLink)).toBe(false)
    })
})

describe('getNoteWeakLinks()', () => {
    test('returns weak links for a note in all houses', () => {
        const expectedResult = [
            [{ row: 1, col: 0 }, { row: 1, col: 1 }], [{ row: 1, col: 0 }, { row: 1, col: 6 }], [{ row: 1, col: 0 }, { row: 1, col: 8 }], [{ row: 1, col: 1 }, { row: 1, col: 6 }], [{ row: 1, col: 1 }, { row: 1, col: 8 }], [{ row: 1, col: 6 }, { row: 1, col: 8 }],
            [{ row: 2, col: 0 }, { row: 2, col: 2 }], [{ row: 2, col: 0 }, { row: 2, col: 8 }], [{ row: 2, col: 2 }, { row: 2, col: 8 }],
            [{ row: 4, col: 0 }, { row: 4, col: 1 }], [{ row: 4, col: 0 }, { row: 4, col: 2 }], [{ row: 4, col: 1 }, { row: 4, col: 2 }],
            [{ row: 6, col: 0 }, { row: 6, col: 2 }], [{ row: 6, col: 0 }, { row: 6, col: 6 }], [{ row: 6, col: 0 }, { row: 6, col: 8 }], [{ row: 6, col: 2 }, { row: 6, col: 6 }], [{ row: 6, col: 2 }, { row: 6, col: 8 }], [{ row: 6, col: 6 }, { row: 6, col: 8 }],
            [{ row: 7, col: 0 }, { row: 7, col: 1 }], [{ row: 7, col: 0 }, { row: 7, col: 6 }], [{ row: 7, col: 0 }, { row: 7, col: 8 }], [{ row: 7, col: 1 }, { row: 7, col: 6 }], [{ row: 7, col: 1 }, { row: 7, col: 8 }], [{ row: 7, col: 6 }, { row: 7, col: 8 }],
            [{ row: 1, col: 0 }, { row: 2, col: 0 }], [{ row: 1, col: 0 }, { row: 4, col: 0 }], [{ row: 1, col: 0 }, { row: 6, col: 0 }], [{ row: 1, col: 0 }, { row: 7, col: 0 }], [{ row: 2, col: 0 }, { row: 4, col: 0 }], [{ row: 2, col: 0 }, { row: 6, col: 0 }], [{ row: 2, col: 0 }, { row: 7, col: 0 }], [{ row: 4, col: 0 }, { row: 6, col: 0 }], [{ row: 4, col: 0 }, { row: 7, col: 0 }], [{ row: 6, col: 0 }, { row: 7, col: 0 }],
            [{ row: 1, col: 1 }, { row: 4, col: 1 }], [{ row: 1, col: 1 }, { row: 7, col: 1 }], [{ row: 4, col: 1 }, { row: 7, col: 1 }],
            [{ row: 2, col: 2 }, { row: 4, col: 2 }], [{ row: 2, col: 2 }, { row: 6, col: 2 }], [{ row: 4, col: 2 }, { row: 6, col: 2 }],
            [{ row: 1, col: 6 }, { row: 6, col: 6 }], [{ row: 1, col: 6 }, { row: 7, col: 6 }], [{ row: 6, col: 6 }, { row: 7, col: 6 }],
            [{ row: 1, col: 8 }, { row: 2, col: 8 }], [{ row: 1, col: 8 }, { row: 6, col: 8 }], [{ row: 1, col: 8 }, { row: 7, col: 8 }], [{ row: 2, col: 8 }, { row: 6, col: 8 }], [{ row: 2, col: 8 }, { row: 7, col: 8 }], [{ row: 6, col: 8 }, { row: 7, col: 8 }],
            [{ row: 1, col: 0 }, { row: 1, col: 1 }], [{ row: 1, col: 0 }, { row: 2, col: 0 }], [{ row: 1, col: 0 }, { row: 2, col: 2 }], [{ row: 1, col: 1 }, { row: 2, col: 0 }], [{ row: 1, col: 1 }, { row: 2, col: 2 }], [{ row: 2, col: 0 }, { row: 2, col: 2 }],
            [{ row: 1, col: 6 }, { row: 1, col: 8 }], [{ row: 1, col: 6 }, { row: 2, col: 8 }], [{ row: 1, col: 8 }, { row: 2, col: 8 }],
            [{ row: 4, col: 0 }, { row: 4, col: 1 }], [{ row: 4, col: 0 }, { row: 4, col: 2 }], [{ row: 4, col: 1 }, { row: 4, col: 2 }],
            [{ row: 6, col: 0 }, { row: 6, col: 2 }], [{ row: 6, col: 0 }, { row: 7, col: 0 }], [{ row: 6, col: 0 }, { row: 7, col: 1 }], [{ row: 6, col: 2 }, { row: 7, col: 0 }], [{ row: 6, col: 2 }, { row: 7, col: 1 }], [{ row: 7, col: 0 }, { row: 7, col: 1 }],
            [{ row: 6, col: 6 }, { row: 6, col: 8 }], [{ row: 6, col: 6 }, { row: 7, col: 6 }], [{ row: 6, col: 6 }, { row: 7, col: 8 }], [{ row: 6, col: 8 }, { row: 7, col: 6 }], [{ row: 6, col: 8 }, { row: 7, col: 8 }], [{ row: 7, col: 6 }, { row: 7, col: 8 }],
        ]

        const puzzle = '304520080006090000050070300000689023000734000063152700010960000009040060608217005'
        const { notes, possibleNotes } = getPuzzleDataFromPuzzleString(puzzle)
        expect(getNoteWeakLinks(2, notes, possibleNotes)).toEqual(expectedResult)
    })
})

describe('getRawXChainHints()', () => {
    test('will return first note which has a valid X-Chain cycle', () => {
        const puzzle = '304520080006090000050070300000689023000734000063152700010960000009040060608217005'
        const { mainNumbers, notes, possibleNotes } = getPuzzleDataFromPuzzleString(puzzle)

        const expectedResult = [{
            note: 7,
            chain: [
                { row: 0, col: 1 },
                { row: 0, col: 8 },
                { row: 1, col: 7 },
                { row: 6, col: 7 },
                { row: 6, col: 2 },
                { row: 3, col: 2 },
            ],
            removableNotesHostCells: [{ row: 3, col: 1 }],
        }]
        expect(getRawXChainHints(mainNumbers, notes, possibleNotes)).toEqual(expectedResult)
    })

    describe('Enhancements: ', () => {
        test('omissions will not be treated as x-chain', () => {
            const puzzle = '080300506000405207500007000023710000009654800000023710000100004108506000604002030'
            const { mainNumbers, notes, possibleNotes } = getPuzzleDataFromPuzzleString(puzzle)

            const omissionCumXChain = [{
                note: 1,
                chain: [
                    { row: 2, col: 6 },
                    { row: 8, col: 6 },
                    { row: 8, col: 8 },
                    { row: 2, col: 8 },
                ],
                removableNotesHostCells: [{ row: 2, col: 1 }, { row: 2, col: 2 }],
            }]
            expect(getRawXChainHints(mainNumbers, notes, possibleNotes)).not.toEqual(omissionCumXChain)
        })
    })
})

describe('removeRedundantLinks()', () => {
    test('removes redundant links between cells', () => {
        const links = {
            1: [10, 28, 64, 9, 10],
            8: [17, 62, 71, 16, 17],
            9: [10, 16, 17, 27, 54, 63, 1, 10],
        }
        const expectedResult = {
            1: [10, 28, 64, 9],
            8: [17, 62, 71, 16],
            9: [10, 16, 17, 27, 54, 63, 1],
        }
        removeRedundantLinks(links)
        expect(links).toEqual(expectedResult)
    })
})

/*

    // strong and weak links mapping structure
    {
      '9': [
        10, 15, 17, 18, 36,
        54, 63, 10, 18, 20
      ],
      '10': [
         9, 15, 17, 37,
        64,  9, 18, 20
      ],
      '15': [
         9, 10, 17, 60,
        69, 17, 26
      ],
      '17': [
         9, 10, 15, 26,
        62, 71, 15, 26
      ],
      '18': [
        20, 26,  9, 36, 54,
        63,  9, 10, 20
      ],
      '20': [
        18, 26, 38, 56,
         9, 10, 18
      ],
      '26': [
        18, 20, 17, 62,
        71, 15, 17
      ],
      '36': [
        37, 38,  9, 18,
        54, 63, 37, 38
      ],
      '37': [ 36, 38, 10, 64, 36, 38 ],
      '38': [ 36, 37, 20, 56, 36, 37 ],
      '54': [
        56, 60, 62,  9, 18,
        36, 63, 56, 63, 64
      ],
      '56': [
        54, 60, 62, 20,
        38, 54, 63, 64
      ],
      '60': [
        54, 56, 62, 15,
        69, 62, 69, 71
      ],
      '62': [
        54, 56, 60, 17, 26,
        71, 60, 69, 71
      ],
      '63': [
        64, 69, 71,  9, 18,
        36, 54, 54, 56, 64
      ],
      '64': [
        63, 69, 71, 10,
        37, 54, 56, 63
      ],
      '69': [
        63, 64, 71, 15,
        60, 60, 62, 71
      ],
      '71': [
        63, 64, 69, 17, 26,
        62, 60, 62, 69
      ]
    }

*/

describe('getTrimWeakLinksFromEdges()', () => {
    test('removes weak links from start and end and will mark links beside these removed weak links as Last', () => {
        const chain = [
            {
                start: 10, end: 1, type: 'WEAK', isTerminal: true,
            },
            {
                start: 1, end: 8, type: 'STRONG', isTerminal: false,
            },
            {
                start: 8, end: 16, type: 'WEAK', isTerminal: false,
            },
            {
                start: 16, end: 61, type: 'STRONG', isTerminal: false,
            },
            {
                start: 61, end: 62, type: 'WEAK', isTerminal: true,
            },
        ]

        const expectedResult = [
            {
                start: 1, end: 8, type: 'STRONG', isTerminal: true,
            },
            {
                start: 8, end: 16, type: 'WEAK', isTerminal: false,
            },
            {
                start: 16, end: 61, type: 'STRONG', isTerminal: true,
            },
        ]

        expect(getTrimWeakLinksFromEdges(chain)).toEqual(expectedResult)
    })

    test('removes weak links from only side if weak link is present only in one side', () => {
        const chain = [
            {
                start: 10, end: 1, type: 'WEAK', isTerminal: true,
            },
            {
                start: 1, end: 8, type: 'STRONG', isTerminal: false,
            },
            {
                start: 8, end: 16, type: 'WEAK', isTerminal: false,
            },
            {
                start: 16, end: 61, type: 'STRONG', isTerminal: true,
            },
        ]

        const expectedResult = [
            {
                start: 1, end: 8, type: 'STRONG', isTerminal: true,
            },
            {
                start: 8, end: 16, type: 'WEAK', isTerminal: false,
            },
            {
                start: 16, end: 61, type: 'STRONG', isTerminal: true,
            },
        ]

        expect(getTrimWeakLinksFromEdges(chain)).toEqual(expectedResult)
    })

    test('returns chain as it is if there is not weak link in the edge', () => {
        const chain = [
            {
                start: 1, end: 8, type: 'STRONG', isTerminal: true,
            },
        ]

        const expectedResult = [
            {
                start: 1, end: 8, type: 'STRONG', isTerminal: true,
            },
        ]

        expect(getTrimWeakLinksFromEdges(chain)).toEqual(expectedResult)
    })

    test('returns empty list if only link is weak', () => {
        const chain = [{
            start: 1, end: 8, type: 'WEAK', isTerminal: true,
        }]

        expect(getTrimWeakLinksFromEdges(chain)).toEqual([])
    })
})

describe.skip('analyzeChain()', () => {
    describe('returns empty array as chain for invalid chains', () => {
        test('chain has less than 3 links after trimming weak links from edges', () => {
            const chain = [
                {
                    start: 10, end: 1, type: 'WEAK', isTerminal: true,
                },
                {
                    start: 1, end: 8, type: 'STRONG', isTerminal: false,
                },
                {
                    start: 8, end: 16, type: 'STRONG', isTerminal: true,
                },
            ]

            const puzzle = '304520080006090000050070300000689023000734000063152700010960000009040060608217005'
            const { notes } = getPuzzleDataFromPuzzleString(puzzle)

            const expectedResult = { foundChain: false, chainResult: null }
            expect(analyzeChain(7, chain, notes)).toEqual(expectedResult)
        })

        test('chain does not remove any notes from cells', () => {
            const puzzle = '270060540050127080300400270000046752027508410500712908136274895785001024002000107'
            const { notes: _notes } = getPuzzleDataFromPuzzleString(puzzle)

            const chain = [
                {
                    start: 11, end: 47, type: 'STRONG', isTerminal: true,
                },
                {
                    start: 47, end: 46, type: 'STRONG', isTerminal: false,
                },
                {
                    start: 46, end: 73, type: 'STRONG', isTerminal: false,
                },
                {
                    start: 73, end: 72, type: 'STRONG', isTerminal: false,
                },
                {
                    start: 72, end: 9, type: 'STRONG', isTerminal: true,
                },
            ]

            const expectedResult = { foundChain: false, chainResult: null }
            expect(analyzeChain(4, chain, _notes)).toEqual(expectedResult)
        })
    })

    describe('valid chains will return full chain or its subchain with a flag telling that valid chain has been found', () => {
        test('chain made of all Strong Links, full chain or any of its subchain will be returned after its links transformed into a normal chain (STRONG -> WEAK -> STRONG...)', () => {
            const puzzle = '270060540050127080300400270000046752027508410500712908136274895785001024002000107'
            const { notes: _notes } = getPuzzleDataFromPuzzleString(puzzle)

            const chain = [
                {
                    start: 30, end: 40, type: 'STRONG', isTerminal: true,
                },
                {
                    start: 40, end: 44, type: 'STRONG', isTerminal: false,
                },
                {
                    start: 44, end: 52, type: 'STRONG', isTerminal: false,
                },
                {
                    start: 52, end: 79, type: 'STRONG', isTerminal: false,
                },
                {
                    start: 79, end: 69, type: 'STRONG', isTerminal: true,
                },
            ]
            const expectedResult = {
                foundChain: true,
                chainResult: {
                    chain: [
                        {
                            start: 40, end: 44, type: 'STRONG', isTerminal: true,
                        },
                        {
                            start: 44, end: 52, type: 'WEAK', isTerminal: false,
                        },
                        {
                            start: 52, end: 79, type: 'STRONG', isTerminal: true,
                        },
                    ],
                    removableNotesHostCells: [{ row: 8, col: 4 }],
                },
            }

            expect(analyzeChain(3, chain, _notes)).toEqual(expectedResult)
        })

        test('chain made of mix of STRONG and WEAK links ', () => {
            const chain = [
                {
                    start: 9, end: 1, type: 'WEAK', isTerminal: true,
                },
                {
                    start: 1, end: 8, type: 'STRONG', isTerminal: false,
                },
                {
                    start: 8, end: 16, type: 'WEAK', isTerminal: false,
                },
                {
                    start: 16, end: 61, type: 'STRONG', isTerminal: false,
                },
                {
                    start: 61, end: 56, type: 'WEAK', isTerminal: false,
                },
                {
                    start: 56, end: 29, type: 'STRONG', isTerminal: false,
                },
                {
                    start: 29, end: 28, type: 'WEAK', isTerminal: true,
                },
            ]
            const expectedResult = {
                foundChain: true,
                chainResult: {
                    chain: [
                        {
                            start: 1, end: 8, type: 'STRONG', isTerminal: true,
                        },
                        {
                            start: 8, end: 16, type: 'WEAK', isTerminal: false,
                        },
                        {
                            start: 16, end: 61, type: 'STRONG', isTerminal: false,
                        },
                        {
                            start: 61, end: 56, type: 'WEAK', isTerminal: false,
                        },
                        {
                            start: 56, end: 29, type: 'STRONG', isTerminal: true,
                        },
                    ],
                    removableNotesHostCells: [{ row: 3, col: 1 }],
                },
            }
            const puzzle = '304520080006090000050070300000689023000734000063152700010960000009040060608217005'
            const { notes } = getPuzzleDataFromPuzzleString(puzzle)
            expect(analyzeChain(7, chain, notes)).toEqual(expectedResult)
        })
    })
})

describe('alternateChainLinks()', () => {
    test('will return chain after switching its in-between strong links, for pure Strong Link chain Edge links will always be STRONG', () => {
        const chain = [
            {
                start: 10, end: 1, type: 'STRONG', isTerminal: true,
            },
            {
                start: 1, end: 8, type: 'STRONG', isTerminal: false,
            },
            {
                start: 8, end: 16, type: 'STRONG', isTerminal: false,
            },
            {
                start: 16, end: 78, type: 'STRONG', isTerminal: false,
            },
            {
                start: 78, end: 65, type: 'STRONG', isTerminal: true,
            },
        ]
        const expectedResult = [
            {
                start: 10, end: 1, type: 'STRONG', isTerminal: true,
            },
            {
                start: 1, end: 8, type: 'WEAK', isTerminal: false,
            },
            {
                start: 8, end: 16, type: 'STRONG', isTerminal: false,
            },
            {
                start: 16, end: 78, type: 'WEAK', isTerminal: false,
            },
            {
                start: 78, end: 65, type: 'STRONG', isTerminal: true,
            },
        ]
        expect(alternateChainLinks(chain)).toEqual(expectedResult)
    })

    // chain will be transformed such that links become like "... WEAK -> STRONG -> WEAK -> STRONG -> ..."
    test('for mixed chain, edge links might be WEAK after transformation', () => {
        const chain = [
            {
                start: 10, end: 1, type: 'STRONG', isTerminal: true,
            },
            {
                start: 1, end: 8, type: 'STRONG', isTerminal: false,
            },
            {
                start: 8, end: 16, type: 'WEAK', isTerminal: false,
            },
            {
                start: 16, end: 78, type: 'STRONG', isTerminal: false,
            },
            {
                start: 78, end: 65, type: 'STRONG', isTerminal: true,
            },
        ]
        const expectedResult = [
            {
                start: 10, end: 1, type: 'WEAK', isTerminal: true,
            },
            {
                start: 1, end: 8, type: 'STRONG', isTerminal: false,
            },
            {
                start: 8, end: 16, type: 'WEAK', isTerminal: false,
            },
            {
                start: 16, end: 78, type: 'STRONG', isTerminal: false,
            },
            {
                start: 78, end: 65, type: 'WEAK', isTerminal: true,
            },
        ]
        expect(alternateChainLinks(chain)).toEqual(expectedResult)
    })
})

describe.skip('getAllValidSubChains()', () => {
    // will analyze all the subchains of odd length, starting at 3
    // subchains must start and end with STRONG link
    // STRONG and WEAK links must be alternate
    // returns a list of sub-chains including complete chain if they remove some notes
    test('chain containing all the STRONG links, some STRONG links will be changed to WEAK', () => {
        const puzzle = '270060540050127080300400270000046752027508410500712908136274895785001024002000107'
        const { notes: _notes } = getPuzzleDataFromPuzzleString(puzzle)

        const chain = [
            {
                start: 30, end: 40, type: 'STRONG', isTerminal: true,
            },
            {
                start: 40, end: 44, type: 'STRONG', isTerminal: false,
            },
            {
                start: 44, end: 52, type: 'STRONG', isTerminal: false,
            },
            {
                start: 52, end: 79, type: 'STRONG', isTerminal: false,
            },
            {
                start: 79, end: 69, type: 'STRONG', isTerminal: true,
            },
        ]

        const expectedResult = [
            {
                chain: [
                    {
                        start: 40, end: 44, type: 'STRONG', isTerminal: true,
                    },
                    {
                        start: 44, end: 52, type: 'WEAK', isTerminal: false,
                    },
                    {
                        start: 52, end: 79, type: 'STRONG', isTerminal: true,
                    },
                ],
                removableNotesHostCells: [{ row: 8, col: 4 }],
            },
            {
                chain: [
                    {
                        start: 30, end: 40, type: 'STRONG', isTerminal: true,
                    },
                    {
                        start: 40, end: 44, type: 'WEAK', isTerminal: false,
                    },
                    {
                        start: 44, end: 52, type: 'STRONG', isTerminal: false,
                    },
                    {
                        start: 52, end: 79, type: 'WEAK', isTerminal: false,
                    },
                    {
                        start: 79, end: 69, type: 'STRONG', isTerminal: true,
                    },
                ],
                removableNotesHostCells: [{ row: 7, col: 3 }],
            },
        ]

        expect(getAllValidSubChains(3, chain, _notes)).toEqual(expectedResult)
    })

    test('returns empty list if no sub-chain removes any note', () => {
        const puzzle = '270060540050127080300400270000046752027508410500712908136274895785001024002000107'
        const { notes: _notes } = getPuzzleDataFromPuzzleString(puzzle)

        const chain = [
            {
                start: 11, end: 47, type: 'STRONG', isTerminal: true,
            },
            {
                start: 47, end: 46, type: 'STRONG', isTerminal: false,
            },
            {
                start: 46, end: 73, type: 'STRONG', isTerminal: false,
            },
            {
                start: 73, end: 72, type: 'STRONG', isTerminal: false,
            },
            {
                start: 72, end: 9, type: 'STRONG', isTerminal: true,
            },
        ]

        expect(getAllValidSubChains(4, chain, _notes)).toEqual([])
    })

    test('chain containing mix of STRONG and WEAK links', () => {
        const CELLS_VS_NOTES = {
            2: [4],
            4: [4],
            14: [4],
            17: [4],
            22: [4],
            25: [4],
            58: [4],
            61: [4],
            62: [4],
            71: [4],
            80: [4],
        }
        const _notes = generateCustomNotes(CELLS_VS_NOTES)

        const chain = [
            {
                start: 2, end: 4, type: 'STRONG', isTerminal: true,
            },
            {
                start: 4, end: 14, type: 'STRONG', isTerminal: false,
            },
            {
                start: 14, end: 17, type: 'WEAK', isTerminal: false,
            },
            {
                start: 17, end: 25, type: 'STRONG', isTerminal: false,
            },
            {
                start: 25, end: 61, type: 'STRONG', isTerminal: false,
            },
            {
                start: 61, end: 62, type: 'STRONG', isTerminal: true,
            },
        ]

        const expectedResult = [{
            chain: [{
                start: 4, end: 14, type: 'STRONG', isTerminal: true,
            }, {
                start: 14, end: 17, type: 'WEAK', isTerminal: false,
            }, {
                start: 17, end: 25, type: 'STRONG', isTerminal: true,
            }],
            removableNotesHostCells: [{ row: 2, col: 4 }],
        }, {
            chain: [{
                start: 17, end: 25, type: 'STRONG', isTerminal: true,
            }, {
                start: 25, end: 61, type: 'WEAK', isTerminal: false,
            }, {
                start: 61, end: 62, type: 'STRONG', isTerminal: true,
            }],
            removableNotesHostCells: [{ row: 7, col: 8 }, { row: 8, col: 8 }],
        }, {
            chain: [{
                start: 4, end: 14, type: 'STRONG', isTerminal: true,
            }, {
                start: 14, end: 17, type: 'WEAK', isTerminal: false,
            }, {
                start: 17, end: 25, type: 'STRONG', isTerminal: false,
            }, {
                start: 25, end: 61, type: 'WEAK', isTerminal: false,
            }, {
                start: 61, end: 62, type: 'STRONG', isTerminal: true,
            }],
            removableNotesHostCells: [{ row: 6, col: 4 }],
        }]

        expect(getAllValidSubChains(4, chain, _notes)).toEqual(expectedResult)
    })
})

describe('getChosenChainFromValidSubChains()', () => {
    test('returns empty chain if passed subchains list is empty', () => {
        expect(getChosenChainFromValidSubChains([])).toEqual([])
    })

    test('will choose a valid subchain which is smallest in length first and removes most number of notes', () => {
        const subChains = [
            {
                chain: [
                    {
                        start: 40, end: 44, type: 'STRONG', isTerminal: true,
                    },
                    {
                        start: 44, end: 52, type: 'WEAK', isTerminal: false,
                    },
                    {
                        start: 52, end: 79, type: 'STRONG', isTerminal: true,
                    },
                ],
                removableNotesHostCells: [{ row: 8, col: 3 }],
            },
            {
                chain: [
                    {
                        start: 30, end: 40, type: 'STRONG', isTerminal: true,
                    },
                    {
                        start: 40, end: 44, type: 'WEAK', isTerminal: false,
                    },
                    {
                        start: 44, end: 52, type: 'STRONG', isTerminal: false,
                    },
                    {
                        start: 52, end: 79, type: 'WEAK', isTerminal: false,
                    },
                    {
                        start: 79, end: 69, type: 'STRONG', isTerminal: true,
                    },
                ],
                removableNotesHostCells: [{ row: 7, col: 3 }],
            },
            {
                chain: [
                    {
                        start: 40, end: 44, type: 'STRONG', isTerminal: true,
                    },
                    {
                        start: 44, end: 52, type: 'WEAK', isTerminal: false,
                    },
                    {
                        start: 52, end: 67, type: 'STRONG', isTerminal: true,
                    },
                ],
                removableNotesHostCells: [{ row: 0, col: 4 }, { row: 1, col: 4 }, { row: 2, col: 4 }],
            },
        ]

        const expectedResult = {
            chain: [
                {
                    start: 40, end: 44, type: 'STRONG', isTerminal: true,
                },
                {
                    start: 44, end: 52, type: 'WEAK', isTerminal: false,
                },
                {
                    start: 52, end: 67, type: 'STRONG', isTerminal: true,
                },
            ],
            removableNotesHostCells: [{ row: 0, col: 4 }, { row: 1, col: 4 }, { row: 2, col: 4 }],
        }

        expect(getChosenChainFromValidSubChains(subChains)).toEqual(expectedResult)
    })

    test('will choose a shorter subchain over a longer one even though it removes less notes than longer subchain', () => {
        const subChains = [
            {
                chain: [
                    {
                        start: 28, end: 34, type: 'STRONG', isTerminal: true,
                    },
                    {
                        start: 34, end: 70, type: 'WEAK', isTerminal: false,
                    },
                    {
                        start: 70, end: 62, type: 'STRONG', isTerminal: true,
                    },
                ],
                removableNotesHostCells: [{ row: 6, col: 1 }],
            },
            {
                chain: [
                    {
                        start: 28, end: 34, type: 'STRONG', isTerminal: true,
                    },
                    {
                        start: 34, end: 70, type: 'WEAK', isTerminal: false,
                    },
                    {
                        start: 70, end: 62, type: 'STRONG', isTerminal: false,
                    },
                    {
                        start: 62, end: 59, type: 'WEAK', isTerminal: false,
                    },
                    {
                        start: 59, end: 49, type: 'STRONG', isTerminal: true,
                    },
                ],
                removableNotesHostCells: [{ row: 5, col: 0 }, { row: 5, col: 1 }, { row: 5, col: 2 }],
            },
        ]

        const expectedResult = {
            chain: [
                {
                    start: 28, end: 34, type: 'STRONG', isTerminal: true,
                },
                {
                    start: 34, end: 70, type: 'WEAK', isTerminal: false,
                },
                {
                    start: 70, end: 62, type: 'STRONG', isTerminal: true,
                },
            ],
            removableNotesHostCells: [{ row: 6, col: 1 }],
        }

        expect(getChosenChainFromValidSubChains(subChains)).toEqual(expectedResult)
    })
})

describe('chainIsOmission()', () => {
    // Note: this was also an X-Wing
    test('returns true when x-chain is basically an Omission technique', () => {
        const puzzle = '080300506000405207500007000023710000009654800000023710000100004108506000604002030'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)

        const xChain = {
            note: 1,
            chain: [
                { row: 2, col: 6 },
                { row: 8, col: 6 },
                { row: 8, col: 8 },
                { row: 2, col: 8 },
            ],
            removableNotesHostCells: [{ row: 2, col: 1 }, { row: 2, col: 2 }],
        }

        expect(chainIsOmission(xChain, notes)).toBe(true)
    })

    test('returns false when x-chain is not an Omission technique', () => {
        const puzzle = '080300506000405207500007001023710000009654800000023710000100004108506000604002030'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)

        const xChain = {
            note: 2,
            chain: [
                { row: 6, col: 2 },
                { row: 6, col: 0 },
                { row: 0, col: 0 },
                { row: 0, col: 2 },
            ],
            removableNotesHostCells: [{ row: 2, col: 2 }],
        }

        expect(chainIsOmission(xChain, notes)).toBe(false)
    })
})
