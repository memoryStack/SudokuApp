import _filter from '@lodash/filter'

import { NotesRecord } from '../../../RecordUtilities/boardNotes'
import { MainNumbersRecord } from '../../../RecordUtilities/boardMainNumbers'
import { CELLS_IN_HOUSE } from '../../../constants'

import { getHouseCells } from '../../houseCells'
import { getCellRowHouseInfo, getCellColHouseInfo, getCellBlockHouseInfo } from '../../util'

import { maxHintsLimitReached } from '../util'
import { isHintValid } from '../validityTest'
import { HINTS_IDS, NAKED_SINGLE_TYPES } from '../constants'

// TODO: put it in utils and refactore it with unit test cases
export const isNakedSinglePresent = (notes: Notes, cell: Cell) => {
    const cellVisibleNotesList = NotesRecord.getCellVisibleNotesList(notes, cell)
    return {
        present: cellVisibleNotesList.length === 1,
        mainNumber: cellVisibleNotesList.length === 1 ? cellVisibleNotesList[0] : -1,
    }
}

const getNakedSingleType = (cell: Cell, mainNumbers: MainNumbers) => {
    if (isOnlyOneCellEmptyInHouse(getCellRowHouseInfo(cell), mainNumbers)) return NAKED_SINGLE_TYPES.ROW
    if (isOnlyOneCellEmptyInHouse(getCellColHouseInfo(cell), mainNumbers)) return NAKED_SINGLE_TYPES.COL
    if (isOnlyOneCellEmptyInHouse(getCellBlockHouseInfo(cell), mainNumbers)) return NAKED_SINGLE_TYPES.BLOCK
    return NAKED_SINGLE_TYPES.MIX
}

const isOnlyOneCellEmptyInHouse = (house: House, mainNumbers: MainNumbers) => {
    const emptyCellsInHouse = _filter(getHouseCells(house), (cell: Cell) => !MainNumbersRecord.isCellFilled(mainNumbers, cell))
    return emptyCellsInHouse.length === 1
}

export const getNakedSingleRawHints = (mainNumbers: MainNumbers, notes: Notes, maxHintsThreshold: number) => {
    const result = []

    for (let row = 0; row < CELLS_IN_HOUSE; row++) {
        for (let col = 0; col < CELLS_IN_HOUSE; col++) {
            if (maxHintsLimitReached(result, maxHintsThreshold)) break

            if (MainNumbersRecord.isCellFilled(mainNumbers, { row, col })) continue

            const cell = { row, col }
            // TODO: change "mainNumber" field name. it doesn't feel right.
            const { present, mainNumber } = isNakedSinglePresent(notes, cell)
            const isValid = present && isHintValid({ type: HINTS_IDS.NAKED_SINGLE, data: { cell } })
            if (isValid) {
                result.push({ cell, mainNumber, type: getNakedSingleType(cell, mainNumbers) })
            }
        }
    }

    return result
}
