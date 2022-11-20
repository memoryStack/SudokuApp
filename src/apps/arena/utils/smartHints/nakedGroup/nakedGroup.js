import _filter from 'lodash/src/utils/filter'
import _map from 'lodash/src/utils/map'
import _forEach from 'lodash/src/utils/forEach'
import _every from 'lodash/src/utils/every'
import _isEmpty from 'lodash/src/utils/isEmpty'
import _isNull from 'lodash/src/utils/isNull'

import { N_CHOOSE_K } from '../../../../../resources/constants'
import { consoleLog, inRange } from '../../../../../utils/util'

import { HOUSES_COUNT, } from '../../../constants'

import { Houses } from '../../classes/houses'
import { getHouseCells } from '../../houseCells'
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
    getUniqueNotesFromCells,
    getHousesCellsSharedByCells
} from '../../util'

import { isHintValid } from '../validityTest'
import { GROUPS, HOUSE_TYPE } from '../constants'
import { maxHintsLimitReached } from '../util'

import { getUIHighlightData } from './uiHighlightData'
import {
    VALID_CANDIDATE_MINIMUM_INSTANCES_COUNT,
    VALID_CELL_MINIMUM_NOTES_COUNT,
    MAX_VALID_CELLS_COUNT
} from './nakedGroup.constants'

// Five
export const filterNakedGroupEligibleCellsInHouse = (house, groupCandidatesCount, mainNumbers, notesData) => {
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

// FOUR
// this should be out in utils
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

// THREE
const selectedCellsMakeGroup = (cells, notesData, groupCandidatesCount) => {
    const notesInstancesCount = getCellsVisibleNotesInstancesCount(cells, notesData)
    const candidates = Object.keys(notesInstancesCount)
    return candidates.length === groupCandidatesCount && _every(candidates, (candidate) => {
        return inRange(
            notesInstancesCount[candidate],
            { start: VALID_CANDIDATE_MINIMUM_INSTANCES_COUNT, end: groupCandidatesCount }
        )
    })
}

// has potential to be a re-usable util
// TWO
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

// ONE
const isHintRemovesNotesFromCells = (selectedCells, notesData) => {
    const groupCandidates = getUniqueNotesFromCells(selectedCells, notesData)
    return getHousesCellsSharedByCells(selectedCells).some(cell => {
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

const isNewAndValidNakedGroup = (house, selectedCells, groupsFoundInHouses, notesData) => {
    if (isCellsSelectionAlreadyProcessed(selectedCells, house, groupsFoundInHouses)) return false

    const allPossibleNotesPresent = isHintValid({
        type: GROUPS.NAKED_GROUP,
        data: {
            groupCandidates: getUniqueNotesFromCells(selectedCells, notesData),
            hostCells: selectedCells,
        },
    })
    if (!allPossibleNotesPresent) return false

    return isHintRemovesNotesFromCells(selectedCells, notesData)
}

const cacheProcessedGroup = (house, selectedCells, groupsFoundInHouses) => {
    // Note/Issue: the correctness of this DS depends on iterating order of "houseType" loop
    groupsFoundInHouses[house.type][house.num] = selectedCells

    const sharedHouse = getAnotherSharedHouse(house, selectedCells)
    !_isNull(sharedHouse) && (groupsFoundInHouses[sharedHouse.type][sharedHouse.num] = selectedCells)
}

export const getNakedGroupRawData = (groupCandidatesCount, notesData, mainNumbers, maxHintsThreshold) => {
    const houseType = [HOUSE_TYPE.BLOCK, HOUSE_TYPE.ROW, HOUSE_TYPE.COL]

    const groupsFoundInHouses = getDefaultGroupsFoundInHouses()

    const result = []

    hintsSearchLoop: for (let j = 0; j < houseType.length; j++) {
        for (let houseNum = 0; houseNum < HOUSES_COUNT; houseNum++) {
            const house = { type: houseType[j], num: houseNum }
            const validCells = filterNakedGroupEligibleCellsInHouse(house, groupCandidatesCount, mainNumbers, notesData)

            // to avoid computing 7C2 and 7C3, because that might be heavy but it's open for research
            if (!inRange(validCells.length, { start: groupCandidatesCount, end: MAX_VALID_CELLS_COUNT })) continue

            const possibleSelections = N_CHOOSE_K[validCells.length][groupCandidatesCount]

            for (let k = 0; k < possibleSelections.length; k++) {
                // finding for new conbination of cells or numbers
                if (maxHintsLimitReached(result, maxHintsThreshold)) {
                    break hintsSearchLoop
                }

                const selectedCells = _map(possibleSelections[k], (selectionIndex) => validCells[selectionIndex])

                if (!selectedCellsMakeGroup(selectedCells, notesData, groupCandidatesCount)) continue



                const newAndValidNakedGroup = isNewAndValidNakedGroup(house, selectedCells, groupsFoundInHouses, notesData)
                if (!newAndValidNakedGroup) continue

                result.push({ selectedCells })

                cacheProcessedGroup(house, selectedCells, groupsFoundInHouses)
            }
        }
    }

    return result
}

export const highlightNakedDoublesOrTriples = (groupCandidatesCount, notesData, mainNumbers, maxHintsThreshold) => {
    const groupsRawData = getNakedGroupRawData(groupCandidatesCount, notesData, mainNumbers, maxHintsThreshold)

    if (_isEmpty(groupsRawData)) return null

    return _map(groupsRawData, ({ selectedCells }) => {
        consoleLog(selectedCells)
        return getUIHighlightData(selectedCells, notesData)
    })
}
