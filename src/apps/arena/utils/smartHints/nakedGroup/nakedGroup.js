import _filter from 'lodash/src/utils/filter'
import _map from 'lodash/src/utils/map'
import _forEach from 'lodash/src/utils/forEach'
import _every from 'lodash/src/utils/every'

import { N_CHOOSE_K } from '../../../../../resources/constants'
import { consoleLog, inRange } from '../../../../../utils/util'

import { CELLS_IN_HOUSE, HOUSES_COUNT, MAX_INSTANCES_OF_NUMBER, NUMBERS_IN_HOUSE } from '../../../constants'

import {
    areSameCells,
    areSameRowCells,
    areSameColCells,
    areSameBlockCells,
    getCellVisibleNotesCount,
    getRowAndCol,
    getBlockAndBoxNum,
    isCellEmpty,
    forCellEachNote,
    isCellNoteVisible,
    getCellVisibleNotes,
    isCellExists,
} from '../../util'

import { isHintValid } from '../validityTest'
import {
    maxHintsLimitReached,
} from '../util'
import {
    GROUPS, HOUSE_TYPE,
} from '../constants'
import { prepareNakedDublesOrTriplesHintData } from './uiHighlightData'
import { Houses } from '../../classes/houses'
import { getHouseCells } from '../../houseCells'

// TODO: fix this parsing issue. at a lot of places we are
// parsing the groupCandidates into their int form

// TODO: move these constants 
const VALID_CANDIDATE_MINIMUM_INSTANCES_COUNT = 2
const VALID_CELL_MINIMUM_NOTES_COUNT = 2
const MAX_VALID_CELLS_COUNT = 6

const getHouseCellsNum = (cells) => {
    return cells.map(cell => getBlockAndBoxNum(cell).boxNum)
        .sortNumbers()
}

export const filterValidCellsInHouse = (house, groupCandidatesCount, mainNumbers, notesData) => {
    return _filter(getHouseCells(house), (cell) => {
        if (!isCellEmpty(cell, mainNumbers)) return false

        return inRange(
            getCellVisibleNotesCount(notesData[cell.row][cell.col]),
            { start: VALID_CELL_MINIMUM_NOTES_COUNT, end: groupCandidatesCount, }
        )
    })
}

const getDefaultGroupsFoundInHouses = () => {
    return {
        [HOUSE_TYPE.ROW]: {},
        [HOUSE_TYPE.COL]: {},
        [HOUSE_TYPE.BLOCK]: {},
    }
}

const getCellsVisibleNotesInstancesCount = (cells, notesData) => {
    const result = {}
    _forEach(cells, ({ row, col }) => {
        _forEach(getCellVisibleNotes(notesData[row][col]), (note) => {
            if (!result[note]) result[note] = 1
            else result[note]++
        })
    })
    return result
}

const areValidNakedGroupCells = (cells, notesData, groupCandidatesCount) => {
    const groupVisibleNotesInstancesCount = getCellsVisibleNotesInstancesCount(cells, notesData)
    const groupCandidates = Object.keys(groupVisibleNotesInstancesCount)

    return groupCandidates.length === groupCandidatesCount && _every(groupCandidates, (groupCandidate) => {
        return inRange(
            groupVisibleNotesInstancesCount[groupCandidate],
            { start: VALID_CANDIDATE_MINIMUM_INSTANCES_COUNT, end: groupCandidatesCount }
        )
    })
}

const getAnotherSharedHouse = (mainHouse, selectedCells) => {
    if ((Houses.isRowHouse(mainHouse.type) || Houses.isColHouse(mainHouse.type)) && areSameBlockCells(selectedCells)) {
        return {
            type: HOUSE_TYPE.BLOCK,
            num: getBlockAndBoxNum(selectedCells[0]).blockNum
        }
    }

    if (areSameRowCells(selectedCells)) {
        return {
            type: HOUSE_TYPE.ROW,
            num: selectedCells[0].row
        }
    }

    if (areSameColCells(selectedCells)) {
        return {
            type: HOUSE_TYPE.COL,
            num: selectedCells[0].col
        }
    }

    return null
}

const addSharedHouseCellsIfExists = (mainHouse, selectedCells, houseAllCells) => {
    const sharedHouse = getAnotherSharedHouse(mainHouse, selectedCells)
    if (!sharedHouse) return

    _forEach(getHouseCells(sharedHouse), (cell) => {
        if (!isCellExists(cell, houseAllCells)) houseAllCells.push(cell)
    })
}

const isHintRemovesNotesFromCells = (selectedCells, houseAllCells, notesData) => {
    // TODO: might have to extract this into a function
    const groupCandidates = Object.keys(getCellsVisibleNotesInstancesCount(selectedCells, notesData))
        .map(groupCandidate => parseInt(groupCandidate, 10))

    return houseAllCells.some(cell => {
        const isSelectedCell = selectedCells.some(selectedCell => {
            return areSameCells(cell, selectedCell)
        })
        return (
            !isSelectedCell &&
            groupCandidates.some(groupCandidate => {
                return notesData[cell.row][cell.col][groupCandidate - 1].show
            })
        )
    })
}

// TODO: think over the namings harder. i see a lot of in-consistencies
export const highlightNakedDoublesOrTriples = (groupCandidatesCount, notesData, mainNumbers, maxHintsThreshold) => {
    const houseType = [HOUSE_TYPE.BLOCK, HOUSE_TYPE.ROW, HOUSE_TYPE.COL]

    const groupsFoundInHouses = getDefaultGroupsFoundInHouses()

    const hints = []

    hintsSearchLoop: for (let j = 0; j < houseType.length; j++) {
        for (let houseNum = 0; houseNum < HOUSES_COUNT; houseNum++) {
            const house = { type: houseType[j], num: houseNum }
            const houseAllCells = getHouseCells(house)
            const validCells = filterValidCellsInHouse(house, groupCandidatesCount, mainNumbers, notesData)

            // to avoid computing 7C2 and 7C3, because that might be heavy but it's open for research
            if (!inRange(validCells.length, { start: groupCandidatesCount, end: MAX_VALID_CELLS_COUNT })) continue

            const possibleSelections = N_CHOOSE_K[validCells.length][groupCandidatesCount]

            for (let k = 0; k < possibleSelections.length; k++) {
                // finding for new conbination of cells or numbers
                if (maxHintsLimitReached(hints, maxHintsThreshold)) {
                    break hintsSearchLoop
                }

                const selectedCells = _map(possibleSelections[k], (selectionIndex) => validCells[selectionIndex])

                // check these boxes if they are covered or not already
                // QUES -> why are we not doing it for block house as well ?? 
                if (Houses.isRowHouse(houseType[j]) || Houses.isColHouse(houseType[j])) {
                    // TODO: let's wrap this condition into a func
                    // QUES -> why are we assuming that only one group is possible in a house ??
                    const selectedCellsNum = getHouseCellsNum(selectedCells)
                    const houseCellsProcessed = groupsFoundInHouses[house.type][`${houseNum}`] || []
                    if (houseCellsProcessed.sameArrays(selectedCellsNum)) continue
                }

                const validNakedGroup = areValidNakedGroupCells(selectedCells, notesData, groupCandidatesCount)
                if (!validNakedGroup) continue

                addSharedHouseCellsIfExists(house, selectedCells, houseAllCells)

                const groupCandidates = Object.keys(getCellsVisibleNotesInstancesCount(selectedCells, notesData))

                if (!isHintRemovesNotesFromCells(selectedCells, houseAllCells, notesData)) continue

                // TODO: start refactoring from here now
                // Note: the correctness of this DS depends on entries order in "houseType"
                groupsFoundInHouses[house.type][house.num] = getHouseCellsNum(selectedCells)
                if (houseAllCells.length === 15) {
                    // group cells belong to 2 houses, one is block for sure and another one can be either row or col
                    if (areSameRowCells(selectedCells)) {
                        const { row } = selectedCells[0]
                        groupsFoundInHouses[HOUSE_TYPE.ROW][row] = getHouseCellsNum(selectedCells)
                    } else {
                        const { col } = selectedCells[0]
                        groupsFoundInHouses[HOUSE_TYPE.COL][col] = getHouseCellsNum(selectedCells)
                    }
                }

                // TODO: this step must be a lot earlier. just at the moment 
                // when candidates are marked as valid
                const isValidNakedGroup = isHintValid({
                    type: GROUPS.NAKED_GROUP,
                    data: {
                        groupCandidates: groupCandidates.map(candidate => parseInt(candidate, 10)),
                        hostCells: selectedCells,
                    },
                })



                if (isValidNakedGroup) {
                    consoleLog('@@@@ naked group', selectedCells, groupCandidates)
                    const groupCandidatesInInt = groupCandidates.map(groupCandidate => parseInt(groupCandidate, 10))
                    hints.push(
                        prepareNakedDublesOrTriplesHintData(
                            groupCandidatesCount,
                            houseAllCells,
                            selectedCells,
                            groupCandidatesInInt,
                            notesData,
                        ),
                    )
                }
            }
        }
    }

    return hints.length !== 0 ? hints : null
}
