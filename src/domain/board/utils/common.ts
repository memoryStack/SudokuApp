import _get from '@lodash/get'
import _filter from '@lodash/filter'
import _every from '@lodash/every'
import _isEqual from '@lodash/isEqual'
import _map from '@lodash/map'

import { HOUSES_COUNT_OF_A_TYPE, HOUSE_TYPE } from '../board.constants'
import { BoardIterators } from './boardIterators'

import { MainNumbersRecord } from '../records/mainNumbersRecord'
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

const getCellAllPossibleNotes = (cell: Cell, mainNumbers: MainNumbers) => {
    const result: Note[] = []

    if (MainNumbersRecord.isCellFilled(mainNumbers, cell)) return result

    BoardIterators.forCellEachNote(note => {
        if (!isMainNumberPresentInAnyHouseOfCell(note, cell, mainNumbers)) {
            result.push({ noteValue: note, show: 1 })
        } else {
            result.push({ noteValue: note, show: 0 })
        }
    })

    return result
}

const areMultipleMainNumbersInAnyHouseOfCell = (mainNumbers: MainNumbers, cell: Cell, number: number) =>
    mainNumberCountExccedsThresholdInAnyHouseOfCell(number, cell, mainNumbers, 1)

export const duplicatesInPuzzle = (mainNumbers: MainNumbers) => {
    for (let row = 0; row < HOUSES_COUNT_OF_A_TYPE; row++) {
        for (let col = 0; col < HOUSES_COUNT_OF_A_TYPE; col++) {
            if (!MainNumbersRecord.isCellFilled(mainNumbers, { row, col })) continue

            if (areMultipleMainNumbersInAnyHouseOfCell(
                mainNumbers,
                { row, col },
                MainNumbersRecord.getCellMainValue(mainNumbers, { row, col }),
            )) {
                return {
                    present: true,
                    cell: { row, col },
                }
            }
        }
    }

    return { present: false }
}

export {
    isMainNumberPresentInAnyHouseOfCell,
    getCellAllPossibleNotes
}
