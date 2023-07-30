import { N_CHOOSE_K } from '@resources/constants'

import { NotesRecord } from '../../../RecordUtilities/boardNotes'
import { MainNumbersRecord } from '../../../RecordUtilities/boardMainNumbers'
import { HOUSES_COUNT, NUMBERS_IN_HOUSE } from '../../../constants'

import { areSameCells, isCellExists } from '../../util'
import { getHouseCells } from '../../houseCells'

import { GROUPS, HOUSE_TYPE } from '../constants'
import { isHintValid } from '../validityTest'
import { maxHintsLimitReached } from '../util'

const isValidCandidate = (candidateOccurencesCount, groupCandidatesCount) => {
    if (groupCandidatesCount === 2) return candidateOccurencesCount === groupCandidatesCount
    return candidateOccurencesCount >= 2 && candidateOccurencesCount <= groupCandidatesCount
}

export const validCandidatesInHouseAndTheirLocations = (house, groupCandidatesCount, mainNumbers, notesData) => {
    const houseCells = getHouseCells(house)
    const candidatesHostCells = {}
    houseCells.forEach(cell => {
        if (!MainNumbersRecord.isCellFilled(mainNumbers, cell)) {
            NotesRecord.getCellVisibleNotesList(notesData, cell)
                .forEach(note => {
                    if (!candidatesHostCells[note]) candidatesHostCells[note] = []
                    candidatesHostCells[note].push(cell)
                })
        }
    })

    const result = []
    for (let candidate = 1; candidate <= NUMBERS_IN_HOUSE; candidate++) {
        const candidateOccurencesCount = (candidatesHostCells[candidate] || []).length
        if (isValidCandidate(candidateOccurencesCount, groupCandidatesCount)) {
            result.push({
                candidate,
                hostCells: candidatesHostCells[candidate],
            })
        }
    }
    return result
}

const getDistinctCandidatesListInCells = (groupCells, notesData) => {
    const candidates = {}
    groupCells.forEach(cell => {
        NotesRecord.getCellVisibleNotesList(notesData, cell)
            .forEach(note => {
                candidates[note] = true
            })
    })
    return Object.keys(candidates)
}

const isNakedGroup = (groupCandidatesCount, groupCells, notesData) => {
    const candidatesList = getDistinctCandidatesListInCells(groupCells, notesData)
    return groupCandidatesCount === candidatesList.length
}

const isGroupCellsExist = (newHiddenGroupCells, allHiddenGroups) => allHiddenGroups.some(({ groupCells: existingHiddenGroupCells }) => existingHiddenGroupCells.every((existingHiddenGroupCell, idx) => areSameCells(existingHiddenGroupCell, newHiddenGroupCells[idx])))

const findHiddenGroupsFromValidCandidates = (
    validCandidates,
    groupCandidatesCount,
    notesData,
    maxHintsThreshold,
    house,
) => {
    // TODO: put some thought into this condition here
    if (validCandidates.length > 6) throw new Error(`to many valid candidates in house for hidden ${groupCandidatesCount}. unicorn is here ??`)

    const result = []
    const N = validCandidates.length
    const K = groupCandidatesCount

    const allSelections = N_CHOOSE_K[N][K]

    for (let i = 0; i < allSelections.length; i++) {
        if (maxHintsLimitReached(result, maxHintsThreshold)) break

        const selection = allSelections[i]
        const groupCandidates = []
        const groupCells = []
        selection.forEach(idx => {
            const candidateHostCells = validCandidates[idx].hostCells
            groupCandidates.push(validCandidates[idx].candidate)
            candidateHostCells.forEach(cell => {
                if (!isCellExists(cell, groupCells)) groupCells.push(cell)
            })
        })

        if (
            groupCells.length === groupCandidatesCount
            && !isNakedGroup(groupCandidates.length, groupCells, notesData)
        ) {
            result.push({
                house,
                groupCandidates, // TODO: let's remove the 'group' prefix form here for both fields
                groupCells,
            })
        }
    }

    return result
}

export const getHiddenGroupRawHints = (groupCandidatesCount, notesData, mainNumbers, maxHintsThreshold) => {
    const result = []
    const houseIterationOrder = [HOUSE_TYPE.BLOCK, HOUSE_TYPE.ROW, HOUSE_TYPE.COL]
    houseIterationOrder.forEach(houseType => {
        for (let houseNum = 0; houseNum < HOUSES_COUNT; houseNum++) {
            if (maxHintsLimitReached(result, maxHintsThreshold)) break

            const validCandidatesWithLocations = validCandidatesInHouseAndTheirLocations(
                { type: houseType, num: houseNum },
                groupCandidatesCount,
                mainNumbers,
                notesData,
            )

            if (validCandidatesWithLocations.length >= 2) {
                const hiddenGroupsInHouse = findHiddenGroupsFromValidCandidates(
                    validCandidatesWithLocations,
                    groupCandidatesCount,
                    notesData,
                    maxHintsThreshold,
                    { type: houseType, num: houseNum },
                )

                const newHiddenGroups = hiddenGroupsInHouse.filter(group => (
                    !isGroupCellsExist(group.groupCells, result)
                    && isHintValid({
                        type: GROUPS.HIDDEN_GROUP,
                        data: {
                            houseType: group.house.type,
                            groupCandidates: group.groupCandidates,
                            hostCells: group.groupCells,
                        },
                    })
                ))

                result.push(...newHiddenGroups)
            }
        }
    })

    return result
}
