import _filter from '@lodash/filter'
import _map from '@lodash/map'
import _forEach from '@lodash/forEach'
import _every from '@lodash/every'
import _isNull from '@lodash/isNull'
import _inRange from '@lodash/inRange'

import { N_CHOOSE_K } from '@resources/constants'

import { MainNumbersRecord } from '../../../RecordUtilities/boardMainNumbers'
import { NotesRecord } from '../../../RecordUtilities/boardNotes'

import { HOUSES_COUNT } from '../../../constants'

import { Houses } from '../../classes/houses'
import { getHouseCells } from '../../houseCells'
import {
    areSameRowCells,
    areSameColCells,
    areSameBlockCells,
    getBlockAndBoxNum,
    isCellExists,
    areSameCellsSets,
    getUniqueNotesFromCells,
    getHousesCellsSharedByCells,
} from '../../util'

import { isHintValid } from '../validityTest'
import { GROUPS, HOUSE_TYPE } from '../constants'

import {
    VALID_CANDIDATE_MINIMUM_INSTANCES_COUNT,
    VALID_CELL_MINIMUM_NOTES_COUNT,
    MAX_VALID_CELLS_COUNT,
} from './nakedGroup.constants'

export const filterNakedGroupEligibleCellsInHouse = (house, groupCandidatesCount, mainNumbers, notesData) => _filter(getHouseCells(house), cell => {
    if (MainNumbersRecord.isCellFilled(mainNumbers, cell)) return false

    return _inRange(NotesRecord.getCellVisibleNotesCount(notesData, cell), {
        start: VALID_CELL_MINIMUM_NOTES_COUNT,
        end: groupCandidatesCount,
    })
})

const getDefaultGroupsFoundInHouses = () => ({
    [HOUSE_TYPE.ROW]: {},
    [HOUSE_TYPE.COL]: {},
    [HOUSE_TYPE.BLOCK]: {},
})

// TODO: should be renamed, when i read it months later it felt like it will return a map
// with cellID and how many notes are visible in them, but after reading the implementation
// found something else
export const getCellsVisibleNotesInstancesCount = (cells, notesData) => {
    const result = {}
    _forEach(cells, cell => {
        _forEach(NotesRecord.getCellVisibleNotesList(notesData, cell), note => {
            if (!result[note]) result[note] = 1
            else result[note]++
        })
    })
    return result
}

export const selectedCellsMakeGroup = (cells, notesData, groupCandidatesCount) => {
    const notesInstancesCount = getCellsVisibleNotesInstancesCount(cells, notesData)
    const candidates = Object.keys(notesInstancesCount)
    return (
        candidates.length === groupCandidatesCount
        && _every(candidates, candidate => _inRange(notesInstancesCount[candidate], {
            start: VALID_CANDIDATE_MINIMUM_INSTANCES_COUNT,
            end: groupCandidatesCount,
        }))
    )
}

export const getAnotherSharedHouse = (mainHouse, selectedCells) => {
    if (!Houses.isBlockHouse(mainHouse.type)) {
        return areSameBlockCells(selectedCells)
            ? { type: HOUSE_TYPE.BLOCK, num: getBlockAndBoxNum(selectedCells[0]).blockNum }
            : null
    }

    if (areSameRowCells(selectedCells)) {
        return {
            type: HOUSE_TYPE.ROW,
            num: selectedCells[0].row,
        }
    }

    if (areSameColCells(selectedCells)) {
        return {
            type: HOUSE_TYPE.COL,
            num: selectedCells[0].col,
        }
    }

    return null
}

export const isHintRemovesNotesFromCells = (selectedCells, notesData) => {
    const groupCandidates = getUniqueNotesFromCells(selectedCells, notesData)
    return getHousesCellsSharedByCells(selectedCells).some(cell => !isCellExists(cell, selectedCells)
        && groupCandidates.some(groupCandidate => NotesRecord.isNotePresentInCell(notesData, groupCandidate, cell)))
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

export const getNakedGroupRawHints = (groupCandidatesCount, notesData, mainNumbers, maxHintsThreshold) => {
    const houseTypes = [HOUSE_TYPE.BLOCK, HOUSE_TYPE.ROW, HOUSE_TYPE.COL]

    const groupsFoundInHouses = getDefaultGroupsFoundInHouses()

    const result = []

    for (let i = 0; i < houseTypes.length; i++) {
        const houseType = houseTypes[i]
        for (let houseNum = 0; houseNum < HOUSES_COUNT; houseNum++) {
            const house = { type: houseType, num: houseNum }
            const validCells = filterNakedGroupEligibleCellsInHouse(house, groupCandidatesCount, mainNumbers, notesData)

            // to avoid computing 7C2 and 7C3, because that might be heavy but it's open for research
            if (!_inRange(validCells.length, { start: groupCandidatesCount, end: MAX_VALID_CELLS_COUNT })) continue

            const possibleSelections = N_CHOOSE_K[validCells.length][groupCandidatesCount]

            for (let k = 0; k < possibleSelections.length; k++) {
                const selectedCells = _map(possibleSelections[k], selectionIndex => validCells[selectionIndex])

                if (!selectedCellsMakeGroup(selectedCells, notesData, groupCandidatesCount)) continue

                const newAndValidNakedGroup = isNewAndValidNakedGroup(
                    house,
                    selectedCells,
                    groupsFoundInHouses,
                    notesData,
                )
                if (!newAndValidNakedGroup) continue

                const nakedGroupsCount = result.push({ groupCells: selectedCells })
                if (nakedGroupsCount >= maxHintsThreshold) return result

                cacheProcessedGroup(house, selectedCells, groupsFoundInHouses)
            }
        }
    }

    return result
}
