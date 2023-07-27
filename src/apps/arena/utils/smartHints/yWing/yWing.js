import _isEmpty from '@lodash/isEmpty'
import _isEqual from '@lodash/isEqual'
import _find from '@lodash/find'

import { N_CHOOSE_K } from '@resources/constants'
import { consoleLog, sortNumbersArray } from '@utils/util'
import { NotesRecord } from 'src/apps/arena/RecordUtilities/boardNotes'
import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { HOUSES_COUNT } from '../../../constants'
import { getPossibleNotes } from '../../../store/selectors/board.selectors'
import {
    getCellHousesInfo,
    getCellHouseForHouseType,
    isCellEmpty,
    getPairCellsCommonHouses,
    getCellVisibleNotes,
    getCellVisibleNotesCount,
    areSameCellsSets,
    forBoardEachCell,
    areCommonHouseCells,
} from '../../util'
import { HOUSE_TYPE } from '../constants'
import { maxHintsLimitReached } from '../util'
import { getEliminatableNotesCells } from './utils'

const VALID_NOTES_COUNT_IN_CELL = 2
const VALID_NOTES_COUNT_IN_CELLS_PAIR = 3

// not a good way to throw warn based on this count
// what if N_CHOOSE_K is changed then this variable has to be updated as well.
// and this is called coupling my friend
const N_CHOOSE_K_LIMIT = 6

export const isValidYWingCell = (userInputNotes, allPossibleNotes) => {
    const possibleNotesCount = getCellVisibleNotesCount(allPossibleNotes)
    if (possibleNotesCount !== VALID_NOTES_COUNT_IN_CELL) return false

    const userInputNotesCount = getCellVisibleNotesCount(userInputNotes)
    return userInputNotesCount === VALID_NOTES_COUNT_IN_CELL
}

export const getAllValidYWingCells = (mainNumbers, userInputNotes) => {
    const possibleNotes = getPossibleNotes(getStoreState())

    const result = []
    forBoardEachCell(cell => {
        if (!isCellEmpty(cell, mainNumbers)) return
        const cellUserInputNotes = NotesRecord.getCellNotes(userInputNotes, cell)
        const cellAllPossibleNotes = NotesRecord.getCellNotes(possibleNotes, cell)
        if (isValidYWingCell(cellUserInputNotes, cellAllPossibleNotes)) {
            result.push({ cell, notes: getCellVisibleNotes(cellUserInputNotes) })
        }
    })

    return result
}

// TODO: add test cases for this func
const addYWingCellInHouses = (yWingCell, housesYWingEligibleCells) => {
    getCellHousesInfo(yWingCell.cell).forEach(({ type, num }) => {
        if (!housesYWingEligibleCells[type]) housesYWingEligibleCells[type] = {}
        if (!housesYWingEligibleCells[type][num]) housesYWingEligibleCells[type][num] = []
        housesYWingEligibleCells[type][num].push(yWingCell)
    })
}

export const isValidYWingCellsPair = (yWingCellA, yWingCellB) => {
    const cellANotes = yWingCellA.notes
    const cellBNotes = yWingCellB.notes

    const allNotes = {}
    cellANotes.concat(cellBNotes).forEach(note => {
        allNotes[note] = true
    })
    return Object.keys(allNotes).length === VALID_NOTES_COUNT_IN_CELLS_PAIR
}

const getCommonNoteInCells = (cellANotes, cellBNotes) => _find(cellANotes, cellANote => cellBNotes.includes(cellANote))

export const getSecondWingExpectedNotes = (pivotNotes, firstWingNotes) => {
    const commonNote = getCommonNoteInCells(pivotNotes, firstWingNotes)
    const expectedNotes = pivotNotes
        .concat(firstWingNotes)
        .filter(note => note !== commonNote)
    return sortNumbersArray(expectedNotes)
}

const extractYWingCellsFromYWing = yWing => {
    const pivotCell = yWing.pivot.cell
    const wingCells = yWing.wings.map(wing => wing.cell)
    return [pivotCell, ...wingCells]
}

const areSameYWings = (yWingA, yWingB) => {
    const yWingACells = extractYWingCellsFromYWing(yWingA)
    const yWingBCells = extractYWingCellsFromYWing(yWingB)
    return areSameCellsSets(yWingACells, yWingBCells)
}

const isDuplicateYWing = (newYWing, existingYWings) => existingYWings.some(existingYWing => areSameYWings(newYWing, existingYWing))

const categorizeYWingCellsInHouses = yWingCells => {
    const result = {}
    yWingCells.forEach(yWingCell => {
        addYWingCellInHouses(yWingCell, result)
    })
    return result
}

const getPivotHousesToSearchForSecondWing = (yWingCellA, yWingCellB) => {
    const commonHouses = getPairCellsCommonHouses(yWingCellA, yWingCellB)
    const allHouses = [HOUSE_TYPE.BLOCK, HOUSE_TYPE.ROW, HOUSE_TYPE.COL]
    return allHouses.filter(houseType => !commonHouses[houseType])
}

const getEligibleSecondWings = (expectedNotes, eligibleYWingCells) => eligibleYWingCells.filter(eligibleYWingCell => _isEqual(eligibleYWingCell.notes, expectedNotes))

const getHouseYWings = ({ type, num }, housesYWingEligibleCells) => {
    const result = []

    const yWingEligibleCells = housesYWingEligibleCells[type]?.[num] || []

    if (yWingEligibleCells.length > N_CHOOSE_K_LIMIT) {
        consoleLog('found more than 6 cells with only 2 notes in them')
    }

    const eligibleCellsCombinations = N_CHOOSE_K[yWingEligibleCells.length]?.[2] || []
    eligibleCellsCombinations
        .filter(combination => isValidYWingCellsPair(yWingEligibleCells[combination[0]], yWingEligibleCells[combination[1]]))
        .forEach(combination => {
            const firstEligibleCell = yWingEligibleCells[combination[0]]
            const secondEligibleCell = yWingEligibleCells[combination[1]]

            const pivotHousesToSearch = getPivotHousesToSearchForSecondWing(
                firstEligibleCell.cell,
                secondEligibleCell.cell,
            )

            const possiblePivots = [firstEligibleCell, secondEligibleCell]
            possiblePivots.forEach((pivot, index) => {
                const firstWing = possiblePivots[1 - index]
                const secondWingExpectedNotes = getSecondWingExpectedNotes(pivot.notes, firstWing.notes)

                pivotHousesToSearch.forEach(secondWingHouseType => {
                    const { num: secondWingHouseNum } = getCellHouseForHouseType(secondWingHouseType, pivot.cell)
                    getEligibleSecondWings(
                        secondWingExpectedNotes,
                        housesYWingEligibleCells[secondWingHouseType][secondWingHouseNum],
                    )
                        .filter(eligibleSecondWing => !areCommonHouseCells(firstWing.cell, eligibleSecondWing.cell))
                        .forEach(secondWing => {
                            result.push({
                                pivot,
                                wings: [firstWing, secondWing],
                                wingsCommonNote: getCommonNoteInCells(firstWing.notes, secondWing.notes),
                            })
                        })
                })
            })
        })

    return result
}

const yWingRemovesNotes = (yWing, notesData) => !_isEmpty(getEliminatableNotesCells(yWing, notesData))

export const getYWingRawHints = (mainNumbers, notesData, maxHintsThreshold) => {
    const result = []

    const housesYWingEligibleCells = categorizeYWingCellsInHouses(getAllValidYWingCells(mainNumbers, notesData))
    const allHouses = [HOUSE_TYPE.BLOCK, HOUSE_TYPE.ROW, HOUSE_TYPE.COL]
    allHouses.forEach(houseType => {
        for (let houseNum = 0; houseNum < HOUSES_COUNT; houseNum++) {
            if (maxHintsLimitReached(result, maxHintsThreshold)) break

            const houseYWings = getHouseYWings({ type: houseType, num: houseNum }, housesYWingEligibleCells)
                .filter(newYWing => !isDuplicateYWing(newYWing, result) && yWingRemovesNotes(newYWing, notesData))
                .slice(0, maxHintsThreshold)
            result.push(...houseYWings)
        }
    })

    return result
}
