// NOTE: take some handlers from naked double or tripple as well
// they might come in handy in this hint

import _forEach from 'lodash/src/utils/forEach'
import { consoleLog } from '../../../../../utils/util'

import { forEachHouse, getCellVisibleNotes } from '../../util'
import { HOUSE_TYPE } from '../constants'
import { filterNakedGroupEligibleCellsInHouse } from '../nakedGroup/nakedGroup'
import { cellHasAllPossibleNotes } from '../validityTest/validity.helpers'

import {
    NOTES_COUNT_IN_ELIGIBLE_CELLS,
    VALID_NOTES_PAIRS_HOST_CELLS_COUNT_THRESHOLD,
} from './remotePairs.constants'

export const getRemotePairsRawHints = (mainNumbers, notes, maxHintsThreshold) => {
    const cellsWithValidNotes = getAllValidCellsWithPairs(mainNumbers, notes)
    const notesPairsHostCells = getHostCellsForEachNotesPair(cellsWithValidNotes, notes)
    deleteInvalidNotesPairsKeys(notesPairsHostCells)
}

export const getAllValidCellsWithPairs = (mainNumbers, notes) => {
    const result = []
    forEachHouse(num => {
        const validCells = filterNakedGroupEligibleCellsInHouse(
            { type: HOUSE_TYPE.ROW, num },
            NOTES_COUNT_IN_ELIGIBLE_CELLS,
            mainNumbers,
            notes,
        ).filter(cell => cellHasAllPossibleNotes(cell, notes[cell.row][cell.col]))
        result.push(...validCells)
    })
    return result
}

export const getHostCellsForEachNotesPair = (cells, notes) => {
    const result = {}
    _forEach(cells, cell => {
        const key = getMapKeyFromNotesPair(getCellVisibleNotes(notes[cell.row][cell.col]))
        if (result[key]) result[key].push(cell)
        else result[key] = [cell]
    })
    return result
}

const getMapKeyFromNotesPair = notes => `${notes[0]}${notes[1]}`

// TODO: check the eslinting error here
// check if it's allowable for functions which has side effects
export const deleteInvalidNotesPairsKeys = notesPairsHostCells => {
    const keys = Object.keys(notesPairsHostCells)
    _forEach(keys, key => {
        if (notesPairsHostCells[key].length < VALID_NOTES_PAIRS_HOST_CELLS_COUNT_THRESHOLD) delete notesPairsHostCells[key]
    })
}

const getNotesPairFromMapKey = key => [Number(key[0]), Number(key[1])]
