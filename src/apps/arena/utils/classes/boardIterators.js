import { CELLS_IN_HOUSE, HOUSES_COUNT, NUMBERS_IN_HOUSE } from '../../constants'
import { getHouseCells } from '../houseCells'

const forBoardEachCell = callback => {
    for (let row = 0; row < HOUSES_COUNT; row++) {
        for (let col = 0; col < CELLS_IN_HOUSE; col++) {
            callback({ row, col })
        }
    }
}

const forCellEachNote = callback => {
    for (let note = 1; note <= NUMBERS_IN_HOUSE; note++) {
        const noteValue = note
        const noteIndx = note - 1
        callback(noteValue, noteIndx)
    }
}

const forHouseEachCell = (house, callback) => {
    getHouseCells(house).forEach(cell => {
        callback(cell)
    })
}

// TODO: rename it to forEachHouseNum
const forEachHouse = callback => {
    for (let houseNum = 0; houseNum < HOUSES_COUNT; houseNum++) callback(houseNum)
}

export const BoardIterators = {
    forBoardEachCell,
    forCellEachNote,
    forHouseEachCell,
    forEachHouse,
}
