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
<<<<<<< Updated upstream
=======
import { BoardIterators } from '../../classes/boardIterators'
import { getNoteHostCellsInHouse } from '../../util'
>>>>>>> Stashed changes

function countRowAndColumnFrequency(objects) {
    const rowsData = []
    const columnsData = []
    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i]
        // Check if the row present
        const rowIndex = rowsData.findIndex((rowObj) => rowObj.row === obj.row)
        if (rowIndex !== -1) {
        // If the row exists,count increases
            rowsData[rowIndex].count++
        } else {
        // If the row doesn't exist, push it in rowsData
            rowsData.push({ row: obj.row, count: 1 })
        }
        // Check if the column is present
        const columnIndex = columnsData.findIndex((colObj) => colObj.column === obj.column)
        if (columnIndex !== -1) {
            // If the column exists,count increases
            columnsData[columnIndex].count++
        }
        else {
        // If the column doesn't exist, push it in columnsData
            columnsData.push({ column: obj.column, count: 1 })
        }
    }
    // returns array of objects containing
    return { rowsData, columnsData }
}
export const findEmptyRectangleInBlock = (note: Note, blockHouse: House, notes: Notes, possibleNotes: Notes) => {
    // const userFilledCells = getNoteHostCellsInHouse(notes)
    // const possibleHostCells = getNoteHostCellsInHouse(possibleNotes)
    // if (!areSameCellsSets(userFilledCells, possibleHostCells)) return null
    // Define a function called countRowAndColumnOccurrences that takes an array of objects as a parameter
    const storeinfo = countRowAndColumnFrequency(notes)
    for(let i = 0; i < storeinfo.length(); i++){

    }

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
<<<<<<< Updated upstream
    for (let i = 0; i < 9; i++) {
        // forHouseEachCell(house : Block , i) {
        //    }
=======
    for (let varNote = 1; varNote <= 9; varNote++) {
        BoardIterators.forEachHouseNum(houseNum => {
            let arr = getNoteHostCellsInHouse(varNote, { type: 'block', num: houseNum }, notes)
        })
>>>>>>> Stashed changes
    }
    return {
        blockHouse: { type: HOUSE_TYPE.BLOCK, num: 4 },
        rowHouse: { type: HOUSE_TYPE.ROW, num: 3 },
        colHouse: { type: HOUSE_TYPE.COL, num: 5 },
        note: 9,
        conjugatePairsHouse: { type: HOUSE_TYPE.COL, num: 1 },
        removableNotesCells: [{ row: 7, col: 5 }],
    }
}