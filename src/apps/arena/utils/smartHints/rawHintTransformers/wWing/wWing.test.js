import { getPuzzleDataFromPuzzleString } from '@domain/board/testingUtils/puzzleDataGenerator'

import { getConjugateHouseAndNakedPairCellsPairing } from './wWing'

describe('should cache game data', () => {
    test('shouldSaveDataOnGameStateChange test 1', () => {
        const puzzle = '294803700308070049076490823937508400861740030425030087702384096043900278089007304'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)

        notes[5][6][5].show = false
        notes[5][6][8].show = false
        notes[5][6][4].show = true

        const wWing = {
            "removableNoteHostCells": [{ "col": 6, "row": 1 }],
            "removableNote": 1,
            "conjugateHouse": {
                "num": 4,
                "type": "row"
            },
            "nakedPairNotes": [1, 5],
            "conjugateNote": 5,
            "nakedPairCells": [
                { "row": 5, "col": 6 },
                { "row": 0, "col": 8 }
            ]
        };

        const expectedResult = {
            'E7': 'F7',
            'E9': 'A9'
        }

        expect(getConjugateHouseAndNakedPairCellsPairing(wWing, notes)).toEqual(expectedResult)
    })
})