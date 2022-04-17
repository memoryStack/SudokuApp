import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { N_CHOOSE_K } from '../../../../../resources/constants'
import { consoleLog } from '../../../../../utils/util'
import { getPossibleNotes } from '../../../store/selectors/board.selectors'
import { getCellHousesInfo, getCellHouseInfo, isCellEmpty, areSameCells, isCellExists } from '../../util'
import { HOUSE_TYPE } from '../constants'
import { getUIHighlightData } from './uiHighlightData'

const VALID_NOTES_COUNT_IN_CELL = 2
const VALID_NOTES_COUNT_IN_CELLS_PAIR = 3
const VALID_NOTES_COUNT_IN_YWING = 3

const isCellHaveOnlyTwoNotes = userInput => {}

// TODO: export this to utils
export const getCellVisibleNotes = notes => {
    const result = []
    notes.forEach(({ noteValue, show }) => {
        if (show) result.push(noteValue)
    })
    return result
}

// TODO: export it to utils
export const getCellVisibleNotesCount = notes => {
    return getCellVisibleNotes(notes).length
}

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
const addYWingCellInHouses = (yWingCell, housesYWingCells) => {
    getCellHousesInfo(yWingCell.cell).forEach(({ type, num }) => {
        if (!housesYWingCells[type]) housesYWingCells[type] = {}
        if (!housesYWingCells[type][num]) housesYWingCells[type][num] = []
        housesYWingCells[type][num].push(yWingCell)
    })
}

// change it's name to "validSetOfNotes". becoz
// this is what it's checking
export const isValidYWingCellsPair = (yWingCellA, yWingCellB) => {
    const cellANotes = yWingCellA.notes
    const cellBNotes = yWingCellB.notes

    const allNotes = {}
    cellANotes.forEach(note => {
        allNotes[note] = true
    })
    cellBNotes.forEach(note => {
        allNotes[note] = true
    })

    return Object.keys(allNotes).length === VALID_NOTES_COUNT_IN_CELLS_PAIR
}

// TODO: put this in utils
export const getPairCellsCommonHouses = (cellA, cellB) => {
    const cellAHouses = getCellHousesInfo(cellA)
    const cellBHouses = getCellHousesInfo(cellB)

    const result = {}
    for (let i = 0; i < cellAHouses.length; i++) {
        const houseType = cellAHouses[i].type
        result[houseType] = cellAHouses[i].num === cellBHouses[i].num
    }

    return result
}

export const getSecondWingExpectedNotes = (pivotNotes, firstWingNotes) => {
    let commonNote
    for (let i = 0; i < pivotNotes.length; i++) {
        if (firstWingNotes.includes(pivotNotes[i])) {
            commonNote = pivotNotes[i]
            break
        }
    }
    const expectedNotes = pivotNotes
        .concat(firstWingNotes)
        .filter(note => note !== commonNote)
        .sort()
    return expectedNotes
}

export const isCommonHouseCells = (cellA, cellB) => {
    const commonHouses = getPairCellsCommonHouses(cellA, cellB)
    return Object.values(commonHouses).includes(true)
}

const extractYWingCells = yWing => {
    const pivotCell = yWing.pivot.cell
    const wingCells = yWing.wings.map(wing => {
        return wing.cell
    })
    return [pivotCell, ...wingCells]
}

const areSameYWings = (yWingA, yWingB) => {
    const yWingACells = extractYWingCells(yWingA)
    const yWingBCells = extractYWingCells(yWingB)
    return yWingACells.every(cell => {
        return isCellExists(cell, yWingBCells)
    })
}

const duplicateYWing = (newYWing, existingYWings) => {
    return existingYWings.some(existingYWing => {
        return areSameYWings(newYWing, existingYWing)
    })
}

const getCommonNoteInWingCells = (cellANotes, cellBNotes) => {
    for (let i = 0; i < cellANotes.length; i++) {
        if (cellBNotes.includes(cellANotes[i])) return cellANotes[i]
    }
}

export const getAllYWings = (mainNumbers, notesData) => {
    const yWingCells = getAllValidYWingCells(mainNumbers, notesData)

    const housesYWingCells = {}
    yWingCells.forEach(yWingCell => {
        addYWingCellInHouses(yWingCell, housesYWingCells)
    })

    // extract this in a new func
    const allHouses = [HOUSE_TYPE.BLOCK, HOUSE_TYPE.ROW, HOUSE_TYPE.COL]
    const rawYWings = []
    allHouses.forEach(houseType => {
        for (let houseNum = 0; houseNum < 9; houseNum++) {
            const houseYWingCells = housesYWingCells[houseType][houseNum]
            if (!houseYWingCells) continue

            const totalYWingCells = houseYWingCells.length

            if (totalYWingCells < 2) continue

            const allCombinations = N_CHOOSE_K[totalYWingCells]?.[2]
            if (!allCombinations) {
                console.warn('found more than 6 cells with only 2 notes in them')
                continue
            }

            allCombinations.forEach(combination => {
                const firstYWingCell = houseYWingCells[combination[0]]
                const secondYWingCell = houseYWingCells[combination[1]]

                if (isValidYWingCellsPair(firstYWingCell, secondYWingCell)) {
                    // find third YWing cell now

                    // potential houses to look for
                    const commonHousesInTwoCells = getPairCellsCommonHouses(firstYWingCell.cell, secondYWingCell.cell)
                    // houses to search for third cell
                    const pivotHousesToSearch = allHouses.filter(houseType => {
                        return !commonHousesInTwoCells[houseType]
                    })

                    // choose a pivot and look for third cell
                    const possiblePivots = [firstYWingCell, secondYWingCell]
                    possiblePivots.forEach((pivot, index) => {
                        const firstWing = possiblePivots[1 - index]
                        const secondWingExpectedNotes = getSecondWingExpectedNotes(pivot.notes, firstWing.notes)
                        pivotHousesToSearch.forEach(secondWingHouseType => {
                            // get second wing
                            const { num: secondWingHouseNum } = getCellHouseInfo(secondWingHouseType, pivot.cell)
                            const secondWings = housesYWingCells[secondWingHouseType][secondWingHouseNum].filter(
                                potentialSecondWing => {
                                    const expectedNotesMatches =
                                        potentialSecondWing.notes.sameArrays(secondWingExpectedNotes)
                                    if (!expectedNotesMatches) {
                                        return false
                                    }
                                    return !isCommonHouseCells(firstWing.cell, potentialSecondWing.cell)
                                },
                            )

                            // there can be more than 1 second wing in the house we are searching
                            secondWings.forEach(secondWing => {
                                const newYWing = {
                                    pivot: pivot,
                                    wings: [firstWing, secondWing],
                                    wingsCommonNote: getCommonNoteInWingCells(firstWing.notes, secondWing.notes),
                                }
                                if (!duplicateYWing(newYWing, rawYWings)) rawYWings.push(newYWing)
                            })
                        })
                    })
                }
            })
        }
    })

    return rawYWings
}

export const getYWingsHints = (mainNumbers, notesData) => {
    const rawYWings = getAllYWings(mainNumbers, notesData)

    return getUIHighlightData(rawYWings, notesData)
}
