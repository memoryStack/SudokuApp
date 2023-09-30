import _forEach from '@lodash/forEach'

import { CELLS_IN_HOUSE, HOUSES_COUNT, NUMBERS_IN_HOUSE } from '../../constants'

import { getHouseCells } from '../houseCells'
import { HOUSE_TYPE } from '../smartHints/constants'

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

const forEachHouseNum = callback => {
    for (let houseNum = 0; houseNum < HOUSES_COUNT; houseNum++) callback(houseNum)
}

const forEachHouse = callback => {
    const allHouses = [HOUSE_TYPE.ROW, HOUSE_TYPE.COL, HOUSE_TYPE.BLOCK]
    _forEach(allHouses, houseType => {
        BoardIterators.forEachHouseNum(houseNum => {
            callback({ type: houseType, num: houseNum })
        })
    })
}

export const BoardIterators = {
    forBoardEachCell,
    forCellEachNote,
    forHouseEachCell,
    forEachHouseNum,
    forEachHouse,
}
