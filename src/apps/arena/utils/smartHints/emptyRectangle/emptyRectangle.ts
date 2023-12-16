/*
    what we need to find out in an empty rectangle
        1. Block House
        2. Row House in which numbers are present in the empty rectangle's block house
        3. Col House in which numbers are present in the empty rectangle's block house
        4. Note that will be highlighted
        5. House With Conjugate Pairs
        6. Removable Notes Cells
*/

import { HOUSE_TYPE } from '../constants'

export const findEmptyRectangleInBlock = (note: Note, blockHouse: House, notes: Notes, possibleNotes: Notes) => {
    // const userFilledCells = getNoteHostCellsInHouse(notes)
    // const possibleHostCells = getNoteHostCellsInHouse(possibleNotes)
    // if (!areSameCellsSets(userFilledCells, possibleHostCells)) return null
    const a = 10
    return {
        blockHouse: { type: HOUSE_TYPE.BLOCK, num: 4 },
        rowHouse: { type: HOUSE_TYPE.ROW, num: 3 },
        colHouse: { type: HOUSE_TYPE.COL, num: 5 },
    }

    /*
        if empty rectangle is found
            {
                rowHouse: ,
                columnHouse,
                blockHouse
            }
        else null
    */
}

export const getEmptyRectangleRawHints = (
    mainNumbers: MainNumbers,
    notes: Notes,
    possibleNotes: Notes,
) => {
    const a = 10
    return {
        blockHouse: { type: HOUSE_TYPE.BLOCK, num: 4 },
        rowHouse: { type: HOUSE_TYPE.ROW, num: 3 },
        colHouse: { type: HOUSE_TYPE.COL, num: 5 },
        note: 9,
        conjugatePairsHouse: { type: HOUSE_TYPE.COL, num: 1 },
        removableNotesCells: [{ row: 7, col: 5 }],
    }
}
