import _filter from 'lodash/src/utils/filter'
import _map from 'lodash/src/utils/map'
import _forEach from 'lodash/src/utils/forEach'
import _every from 'lodash/src/utils/every'
import _isEmpty from 'lodash/src/utils/isEmpty'
import _isNull from 'lodash/src/utils/isNull'

import { N_CHOOSE_K } from '../../../../../resources/constants'
import { consoleLog, inRange } from '../../../../../utils/util'

import { HOUSES_COUNT, } from '../../../constants'

import {
    areSameRowCells,
    areSameColCells,
    areSameBlockCells,
    getCellVisibleNotesCount,

    getBlockAndBoxNum,
    isCellEmpty,

    getCellVisibleNotes,
    isCellExists,
    areSameCellsSets,
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

// TODO: we can make it a more general util
// like getUniqueVisibleNotesInCells and move it to another places
const getGroupCandidatesFromCells = (cells, notesData) => {
    return Object.keys(getCellsVisibleNotesInstancesCount(cells, notesData))
        .map(groupCandidate => parseInt(groupCandidate, 10))
}

// TODO: can rename it but later before closing refactoring
const selectedCellsHaveCorrectNotesInstances = (cells, notesData, groupCandidatesCount) => {
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
    if (!Houses.isBlockHouse(mainHouse.type) && areSameBlockCells(selectedCells)) {
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

const addCellsIfSharedHouseExists = (mainHouse, selectedCells, houseAllCells) => {
    const sharedHouse = getAnotherSharedHouse(mainHouse, selectedCells)

    !_isNull(sharedHouse) && _forEach(getHouseCells(sharedHouse), (cell) => {
        if (!isCellExists(cell, houseAllCells)) houseAllCells.push(cell)
    })
}

const isHintRemovesNotesFromCells = (selectedCells, houseAllCells, notesData) => {
    const groupCandidates = getGroupCandidatesFromCells(selectedCells, notesData)

    return houseAllCells.some(cell => {
        return (
            !isCellExists(cell, selectedCells) &&
            groupCandidates.some(groupCandidate => {
                return notesData[cell.row][cell.col][groupCandidate - 1].show
            })
        )
    })
}

const isCellsSelectionAlreadyProcessed = (selectedCells, house, groupsFoundInHouses) => {
    if (Houses.isBlockHouse(house.type)) return false
    // QUES -> why are we assuming that only one group is possible in a house ??
    const houseCellsProcessed = groupsFoundInHouses[house.type][house.num] || []
    return areSameCellsSets(selectedCells, houseCellsProcessed)
}

const isNewAndValidNakedGroup = (house, selectedCells, houseAllCells, groupsFoundInHouses, notesData) => {
    if (isCellsSelectionAlreadyProcessed(selectedCells, house, groupsFoundInHouses)) return false

    const allPossibleNotesPresent = isHintValid({
        type: GROUPS.NAKED_GROUP,
        data: {
            groupCandidates: getGroupCandidatesFromCells(selectedCells, notesData),
            hostCells: selectedCells,
        },
    })
    if (!allPossibleNotesPresent) return false

    return isHintRemovesNotesFromCells(selectedCells, houseAllCells, notesData)
}

const cacheProcessedGroup = (house, selectedCells, groupsFoundInHouses) => {
    // Note/Issue: the correctness of this DS depends on iterating order of "houseType" loop
    groupsFoundInHouses[house.type][house.num] = selectedCells

    const sharedHouse = getAnotherSharedHouse(house, selectedCells)
    !_isNull(sharedHouse) && (groupsFoundInHouses[sharedHouse.type][sharedHouse.num] = selectedCells)
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

                if (!selectedCellsHaveCorrectNotesInstances(selectedCells, notesData, groupCandidatesCount)) continue

                addCellsIfSharedHouseExists(house, selectedCells, houseAllCells)

                const newAndValidNakedGroup = isNewAndValidNakedGroup(house, selectedCells, houseAllCells, groupsFoundInHouses, notesData)
                if (!newAndValidNakedGroup) continue

                // consoleLog('@@@@ naked group', selectedCells, getGroupCandidatesFromCells(selectedCells, notesData),)
                hints.push(
                    prepareNakedDublesOrTriplesHintData(
                        groupCandidatesCount,
                        houseAllCells,
                        selectedCells,
                        getGroupCandidatesFromCells(selectedCells, notesData),
                        notesData,
                    ),
                )

                cacheProcessedGroup(house, selectedCells, groupsFoundInHouses)
            }
        }
    }

    return _isEmpty(hints) ? null : hints
}
