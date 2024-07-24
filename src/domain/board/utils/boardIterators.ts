import _forEach from '@lodash/forEach'

import { CELLS_IN_A_HOUSE, HOUSES_COUNT, NUMBERS_IN_A_HOUSE, HOUSE_TYPE } from '../board.constants'

import { getHouseCells } from './housesAndCells'

type BoardEachCellCallback = (cell: Cell) => void

type HouseEachCellCallback = (cell: Cell) => void

export type CellEachNoteCallback = (noteValue: number, noteIndx: number) => void

type EachHouseCallback = (house: House) => void

type EachHouseNumCallback = (houseNum: HouseNum) => void

const forBoardEachCell = (callback: BoardEachCellCallback) => {
    for (let row = 0; row < HOUSES_COUNT; row++) {
        for (let col = 0; col < CELLS_IN_A_HOUSE; col++) {
            callback({ row, col })
        }
    }
}

const forCellEachNote = (callback: CellEachNoteCallback) => {
    for (let note = 1; note <= NUMBERS_IN_A_HOUSE; note++) {
        const noteValue = note
        const noteIndx = note - 1
        callback(noteValue, noteIndx)
    }
}

const forHouseEachCell = (house: House, callback: HouseEachCellCallback) => {
    getHouseCells(house).forEach(cell => {
        callback(cell)
    })
}

const forEachHouseNum = (callback: EachHouseNumCallback) => {
    for (let houseNum = 0; houseNum < HOUSES_COUNT; houseNum++) callback(houseNum)
}

const forEachHouse = (callback: EachHouseCallback) => {
    const allHouses = [HOUSE_TYPE.ROW, HOUSE_TYPE.COL, HOUSE_TYPE.BLOCK]
    _forEach(allHouses, (houseType: HouseType) => {
        forEachHouseNum((houseNum: HouseNum) => {
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
