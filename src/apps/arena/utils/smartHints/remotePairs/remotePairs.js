import _forEach from 'lodash/src/utils/forEach'
import _find from 'lodash/src/utils/find'
import _map from 'lodash/src/utils/map'
import _filter from 'lodash/src/utils/filter'
import _every from 'lodash/src/utils/every'
import _isNil from 'lodash/src/utils/isNil'
import _isEmpty from 'lodash/src/utils/isEmpty'
import _some from 'lodash/src/utils/some'
import _reduce from 'lodash/src/utils/reduce'

import isNil from 'lodash/src/utils/isNil'
import { N_CHOOSE_K } from '../../../../../resources/constants'

import {
    areCommonHouseCells,
    convertBoardCellNumToCell,
    convertBoardCellToNum,
    forBoardEachCell,
    forEachHouse,
    getCellVisibleNotes,
    isCellExists,
    isCellNoteVisible,
} from '../../util'

import { filterNakedGroupEligibleCellsInHouse } from '../nakedGroup/nakedGroup'
import { cellHasAllPossibleNotes } from '../validityTest/validity.helpers'
import { HOUSE_TYPE } from '../constants'

import {
    NOTES_COUNT_IN_ELIGIBLE_CELLS,
    VALID_NOTES_PAIRS_HOST_CELLS_COUNT_THRESHOLD,
    COMMON_HOUSE_CELLS_COUNT_FOR_ENDPOINT,
    ENDPOINTS_COUNT,
    MIDDLE_CELLS_VALID_COMMON_HOUSES_CELLS_COUNT,
    CHAIN_VS_REMOVABLE_NOTES_CELL_PARAMETERS,
} from './remotePairs.constants'

// TODO: it will return only one  hint by default
export const getRemotePairsRawHints = (mainNumbers, notes, maxHintsThreshold) => {
    const cellsWithValidNotes = getAllValidCellsWithPairs(mainNumbers, notes)
    const notesPairsHostCells = getHostCellsForEachNotesPair(cellsWithValidNotes, notes)
    deleteInvalidNotesPairsKeys(notesPairsHostCells)

    const rawHintData = getHintRawData(notesPairsHostCells, notes)
    return isNil(rawHintData) ? null : [rawHintData]
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
        if (notesPairsHostCells[key].length < VALID_NOTES_PAIRS_HOST_CELLS_COUNT_THRESHOLD) {
            delete notesPairsHostCells[key]
        }
    })
}

export const getHintRawData = (notesPairsHostCells, notes) => {
    const notesPairsKeys = Object.keys(notesPairsHostCells)
    for (let i = 0; i < notesPairsKeys.length; i++) {
        const remotePairsAllHostCells = notesPairsHostCells[notesPairsKeys[i]]
        const remotePairNotes = getNotesPairFromMapKey(notesPairsKeys[i])

        const validChainCells = getRemotePairsValidChainCells(remotePairNotes, remotePairsAllHostCells, notes)
        if (!_isEmpty(validChainCells)) {
            return {
                remotePairNotes,
                orderedChainCells: getOrderedChainCells(validChainCells),
                removableNotesHostCells: getCellsWithNotesToBeRemoved(validChainCells, remotePairNotes, notes),
            }
        }
    }
    return null
}

export const getRemotePairsValidChainCells = (remotePairNotes, hostCells, notes) => {
    if (hostCells.length === 9) return [] // TODO: analyse it's possibility
    let hostCellsToChoose = VALID_NOTES_PAIRS_HOST_CELLS_COUNT_THRESHOLD
    while (hostCellsToChoose <= hostCells.length) {
        const hostCellsCombinations = N_CHOOSE_K[hostCells.length][hostCellsToChoose]
        const validHintCellsCombination = getValidHintHostCellsCombination(hostCellsCombinations, hostCells, remotePairNotes, notes)
        if (!_isNil(validHintCellsCombination)) {
            return hostCells.atIndexes(validHintCellsCombination)
        }
        hostCellsToChoose++
    }
    return []
}

export const getValidHintHostCellsCombination = (combinations, hostCells, remotePairNotes, notes) => _find(combinations, combination => {
    const chainCells = hostCells.atIndexes(combination)

    if (isValidChainOfCells(chainCells)) {
        return validChainRemovesNotes(chainCells, remotePairNotes, notes)
    }
    return false
})

export const isValidChainOfCells = cells => {
    const eachCellCommonHousesCells = getEachCellCommonHousesCells(cells)
    if (!areValidSetOfCellsInCommonHouses(eachCellCommonHousesCells)) {
        return false
    }
    return isChainPossibleWithAllCells(eachCellCommonHousesCells)
}

/*
    try to optimize the ordering of cells, and cells from which notes will be removed
    because this will be calculated multiple times
*/
export const validChainRemovesNotes = (chainCells, remotePairNotes, notes) => {
    const eligibleCells = getRemovableNotesEligibleCells(chainCells, remotePairNotes, notes)
    return _some(eligibleCells, removableNotesHostCell => isChainRemovesNotesInCell(removableNotesHostCell, getOrderedChainCells(chainCells)))
}

// TODO: can we merge this and above functions ??
export const getCellsWithNotesToBeRemoved = (validChainCells, remoteNotesPair, notes) => getRemovableNotesEligibleCells(validChainCells, remoteNotesPair, notes)
    .filter(removableNotesHostCell => isChainRemovesNotesInCell(removableNotesHostCell, getOrderedChainCells(validChainCells)))

// TODO: write test-cases for it once move it to general utils
// cells without chain cells and which have remotePair notes
// eligible cells from which notes can be removed
const getRemovableNotesEligibleCells = (chainCells, visibleNotes, notes) => {
    // TODO: part of this function can be a util which will extract all the cells which
    // have atleast one of the note from the list
    const result = []
    forBoardEachCell(cell => {
        const anyCellNoteVisible = _some(visibleNotes, note => isCellNoteVisible(note, notes[cell.row][cell.col]))
        if (anyCellNoteVisible) result.push(cell)
    })
    return _filter(result, cell => !isCellExists(cell, chainCells))
}

export const isChainRemovesNotesInCell = (cell, orderedChainCells) => {
    const commonHouseChainCellsIndexes = []
    _forEach(orderedChainCells, (chainCell, indx) => {
        if (areCommonHouseCells(cell, chainCell)) commonHouseChainCellsIndexes.push(indx)
    })

    if (commonHouseChainCellsIndexes.length !== CHAIN_VS_REMOVABLE_NOTES_CELL_PARAMETERS.COMMON_HOUSE_CHAIN_CELLS_COUNT) return false

    const alwaysDifferentNumbersInCells = (commonHouseChainCellsIndexes[1] - commonHouseChainCellsIndexes[0]) % 2 !== 0
    const cellsNotMakingNakedDouble = commonHouseChainCellsIndexes[1] - commonHouseChainCellsIndexes[0] >= CHAIN_VS_REMOVABLE_NOTES_CELL_PARAMETERS.COMMON_HOUSE_CHAIN_CELLS_MIN_GAP
    return alwaysDifferentNumbersInCells && cellsNotMakingNakedDouble
}

// TODO: this function's implementation is very similar to another
// below, try to change the flow to remove this duplication
export const getOrderedChainCells = cells => {
    // TODO: there is no certain order here
    //      it will pick up the top endpoint
    const result = []

    const eachCellCommonHousesCells = getEachCellCommonHousesCells(cells)

    const cellsNum = Object.keys(eachCellCommonHousesCells)

    const cellsVisited = _reduce(cellsNum, (acc, cellNum) => {
        acc[cellNum] = false
        return acc
    }, {})

    let currentCellNum = _find(cellsNum, cellNum => eachCellCommonHousesCells[cellNum].length === COMMON_HOUSE_CELLS_COUNT_FOR_ENDPOINT)
    while (!cellsVisited[currentCellNum]) {
        cellsVisited[currentCellNum] = true
        result.push(convertBoardCellNumToCell(parseInt(currentCellNum, 10)))
        const nextCellToVisit = _find(eachCellCommonHousesCells[currentCellNum], cellInCommonHouse => !cellsVisited[convertBoardCellToNum(cellInCommonHouse)])
        if (nextCellToVisit) currentCellNum = convertBoardCellToNum(nextCellToVisit)
    }

    return result
}

const areValidSetOfCellsInCommonHouses = eachCellCommonHousesCells => {
    const cellsCountInCommonHouses = _map(Object.values(eachCellCommonHousesCells), cellsInCommonHouses => cellsInCommonHouses.length)

    const endPoints = _filter(cellsCountInCommonHouses, cellsCount => cellsCount === COMMON_HOUSE_CELLS_COUNT_FOR_ENDPOINT)
    if (endPoints.length !== ENDPOINTS_COUNT) return false

    return _filter(cellsCountInCommonHouses, cellsCount => cellsCount !== COMMON_HOUSE_CELLS_COUNT_FOR_ENDPOINT)
        .every(cellsCount => cellsCount === MIDDLE_CELLS_VALID_COMMON_HOUSES_CELLS_COUNT)
}

export const isChainPossibleWithAllCells = eachCellCommonHousesCells => {
    const cellsVisited = getCellsVisitedStatus(eachCellCommonHousesCells)
    return _every(Object.values(cellsVisited), isCellVisited => isCellVisited)
}

const getCellsVisitedStatus = eachCellCommonHousesCells => {
    const cellsNum = Object.keys(eachCellCommonHousesCells)

    const cellsVisited = _reduce(cellsNum, (acc, cellNum) => {
        acc[cellNum] = false
        return acc
    }, {})

    let currentCellNum = _find(cellsNum, cellNum => eachCellCommonHousesCells[cellNum].length === COMMON_HOUSE_CELLS_COUNT_FOR_ENDPOINT)
    while (true) {
        cellsVisited[currentCellNum] = true
        const nextCellToVisit = _find(eachCellCommonHousesCells[currentCellNum], cellInCommonHouse => !cellsVisited[convertBoardCellToNum(cellInCommonHouse)])
        if (_isNil(nextCellToVisit)) break
        currentCellNum = convertBoardCellToNum(nextCellToVisit)
    }

    return cellsVisited
}

export const getEachCellCommonHousesCells = cells => {
    const result = {}
    for (let i = 0; i < cells.length; i++) {
        for (let j = i + 1; j < cells.length; j++) {
            const cellsPair = [cells[i], cells[j]]
            if (areCommonHouseCells(...cellsPair)) {
                _forEach(cellsPair, (cell, idx) => {
                    const cellNum = convertBoardCellToNum(cell) // TODO: change this function name
                    // TODO: this kind of if-else usecase comes again and
                    // again, check if it can be done better
                    if (!result[cellNum]) result[cellNum] = [cellsPair[1 - idx]]
                    else result[cellNum].push(cellsPair[1 - idx])
                })
            }
        }
    }
    return result
}

const getNotesPairFromMapKey = key => [Number(key[0]), Number(key[1])]