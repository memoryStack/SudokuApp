import _get from '@lodash/get'
import _filter from '@lodash/filter'
import _every from '@lodash/every'
import _isEqual from '@lodash/isEqual'
import _map from '@lodash/map'

import { CELLS_IN_A_HOUSE, NUMBERS_IN_A_HOUSE, HOUSES_COUNT_OF_A_TYPE, HOUSE_TYPE } from '../board.constants'
import { BoardIterators } from './boardIterators'

import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { getHouseCells, getCellHouseForHouseType } from './housesAndCells'



const mainNumberCountExccedsThresholdInAnyHouseOfCell = (number: number, cell: Cell, mainNumbers: MainNumbers, threshold: number) => {
    const allHouses = [HOUSE_TYPE.ROW, HOUSE_TYPE.COL, HOUSE_TYPE.BLOCK]
    return allHouses.some(houseType => {
        const numberHostCellsInHouse = getHouseCells(getCellHouseForHouseType(houseType, cell))
            .filter((houseCell: Cell) => MainNumbersRecord.isCellFilledWithNumber(mainNumbers, number, houseCell))
        return numberHostCellsInHouse.length > threshold
    })
}

const isMainNumberPresentInAnyHouseOfCell = (number: number, cell: Cell, mainNumbers: MainNumbers) =>
    mainNumberCountExccedsThresholdInAnyHouseOfCell(number, cell, mainNumbers, 0)

export {
    isMainNumberPresentInAnyHouseOfCell
}
