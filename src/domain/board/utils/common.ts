import _get from '@lodash/get'
import _filter from '@lodash/filter'
import _every from '@lodash/every'
import _isEqual from '@lodash/isEqual'
import _map from '@lodash/map'

import { CELLS_IN_A_HOUSE, NUMBERS_IN_A_HOUSE, HOUSES_COUNT_OF_A_TYPE, HOUSE_TYPE } from '../board.constants'
import { BoardIterators } from './boardIterators'

import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { getHouseCells, getCellHouseForHouseType } from './housesAndCells'

const getCellMainNumberDefaultValue = (): MainNumber => ({ value: 0, solutionValue: 0, isClue: false })

const initMainNumbers = () => {
    const result = []
    for (let i = 0; i < HOUSES_COUNT_OF_A_TYPE; i++) {
        const rowData = []
        for (let j = 0; j < CELLS_IN_A_HOUSE; j++) {
            rowData.push(getCellMainNumberDefaultValue())
        }
        result.push(rowData)
    }
    return result
}

const initNotes = () => {
    const result: Notes = []
    for (let row = 0; row < CELLS_IN_A_HOUSE; row++) {
        const rowNotes = []
        for (let col = 0; col < CELLS_IN_A_HOUSE; col++) {
            const boxNotes = []
            for (let note = 1; note <= NUMBERS_IN_A_HOUSE; note++) {
                // this structure can be re-written using [0, 0, 0, 4, 0, 6, 0, 0, 0] represenstion. but let's ignore it for now
                boxNotes.push({ noteValue: note, show: 0 })
            }
            rowNotes.push(boxNotes)
        }
        result.push(rowNotes)
    }
    return result
}

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

const initPossibleNotes = (mainNumbers: MainNumbers) => {
    const notes = initNotes()
    BoardIterators.forBoardEachCell((cell: Cell) => {
        const cellNotes = getCellAllPossibleNotes(cell, mainNumbers)
        notes[cell.row][cell.col] = cellNotes
    })
    return notes
}

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
    initMainNumbers,
    initNotes,
    initPossibleNotes,
    isMainNumberPresentInAnyHouseOfCell
}
