import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { N_CHOOSE_K } from '../../../../../resources/constants'
import { getPossibleNotes } from '../../../store/selectors/board.selectors'
import {
    getCellHousesInfo,
    getCellHouseInfo,
    isCellEmpty,
    isCellExists,
    getPairCellsCommonHouses,
    getCellVisibleNotes,
    getCellVisibleNotesCount,
    areSameCellsSets,
} from '../../util'
import { HOUSE_TYPE } from '../constants'
import { maxHintsLimitReached } from '../util'
import { getYWingHintUIHighlightData } from './uiHighlightData'

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
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (!isCellEmpty({ row, col }, mainNumbers)) continue
            const cellUserInputNotes = userInputNotes[row][col]
            const cellAllPossibleNotes = possibleNotes[row][col]
            if (isValidYWingCell(cellUserInputNotes, cellAllPossibleNotes)) {
                result.push({ cell: { row, col }, notes: getCellVisibleNotes(cellUserInputNotes) })
            }
        }
    }

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

// TODO: change it's name to something general
// it's used for wings cells and also for pivot and wingCells as well
const getCommonNoteInWingCells = (cellANotes, cellBNotes) => {
    for (let i = 0; i < cellANotes.length; i++) {
        if (cellBNotes.includes(cellANotes[i])) return cellANotes[i]
    }
}

export const getSecondWingExpectedNotes = (pivotNotes, firstWingNotes) => {
    const commonNote = getCommonNoteInWingCells(pivotNotes, firstWingNotes)
    const expectedNotes = pivotNotes
        .concat(firstWingNotes)
        .filter(note => note !== commonNote)
        .sort()
    return expectedNotes
}

export const isCellsShareHouse = (cellA, cellB) => {
    const commonHouses = getPairCellsCommonHouses(cellA, cellB)
    return Object.values(commonHouses).includes(true)
}

const extractYWingCellsFromYWing = yWing => {
    const pivotCell = yWing.pivot.cell
    const wingCells = yWing.wings.map(wing => {
        return wing.cell
    })
    return [pivotCell, ...wingCells]
}

const areSameYWings = (yWingA, yWingB) => {
    const yWingACells = extractYWingCellsFromYWing(yWingA)
    const yWingBCells = extractYWingCellsFromYWing(yWingB)
    return areSameCellsSets(yWingACells, yWingBCells)
}

const isDuplicateYWing = (newYWing, existingYWings) => {
    return existingYWings.some(existingYWing => {
        return areSameYWings(newYWing, existingYWing)
    })
}

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
    return allHouses.filter(houseType => {
        return !commonHouses[houseType]
    })
}

const getEligibleSecondWings = (expectedNotes, eligibleYWingCells) => {
    return eligibleYWingCells.filter(eligibleYWingCell => {
        return eligibleYWingCell.notes.sameArrays(expectedNotes)
    })
}

const getHouseYWings = ({ type, num }, housesYWingEligibleCells) => {
    const result = []

    const yWingEligibleCells = housesYWingEligibleCells[type]?.[num] || []

    if (yWingEligibleCells.length > N_CHOOSE_K_LIMIT) {
        console.warn('found more than 6 cells with only 2 notes in them')
    }

    const eligibleCellsCombinations = N_CHOOSE_K[yWingEligibleCells.length]?.[2] || []
    eligibleCellsCombinations
        .filter(combination => {
            return isValidYWingCellsPair(yWingEligibleCells[combination[0]], yWingEligibleCells[combination[1]])
        })
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
                    const { num: secondWingHouseNum } = getCellHouseInfo(secondWingHouseType, pivot.cell)
                    getEligibleSecondWings(
                        secondWingExpectedNotes,
                        housesYWingEligibleCells[secondWingHouseType][secondWingHouseNum],
                    )
                        .filter(eligibleSecondWing => {
                            return !isCellsShareHouse(firstWing.cell, eligibleSecondWing.cell)
                        })
                        .forEach(secondWing => {
                            result.push({
                                pivot: pivot,
                                wings: [firstWing, secondWing],
                                wingsCommonNote: getCommonNoteInWingCells(firstWing.notes, secondWing.notes),
                            })
                        })
                })
            })
        })

    return result
}

export const getAllYWings = (mainNumbers, notesData, maxHintsThreshold) => {
    const result = []

    const housesYWingEligibleCells = categorizeYWingCellsInHouses(getAllValidYWingCells(mainNumbers, notesData))
    const allHouses = [HOUSE_TYPE.BLOCK, HOUSE_TYPE.ROW, HOUSE_TYPE.COL]
    allHouses.forEach(houseType => {
        for (let houseNum = 0; houseNum < 9; houseNum++) {
            if (maxHintsLimitReached(result, maxHintsThreshold)) break

            const houseYWings = getHouseYWings({ type: houseType, num: houseNum }, housesYWingEligibleCells)
                .filter(newYWing => {
                    return !isDuplicateYWing(newYWing, result)
                })
                .slice(0, maxHintsThreshold)

            result.push(...houseYWings)
        }
    })

    return result
}

export const getYWingsHints = (mainNumbers, notesData, maxHintsThreshold) => {
    const rawYWings = getAllYWings(mainNumbers, notesData, maxHintsThreshold)

    if (!rawYWings.length) return null

    return rawYWings.map(yWing => getYWingHintUIHighlightData(yWing, notesData)).filter(yWingHint => !!yWingHint)
}
