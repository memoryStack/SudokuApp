import { N_CHOOSE_K } from '@resources/constants'
import { GROUPS, HOUSE_TYPE } from '../constants'
import { areSameCells, isCellEmpty, isCellExists } from '../../util'
import { getHouseCells } from '../../houseCells'
import { isHintValid } from '../validityTest'
import { maxHintsLimitReached } from '../util'
import { HOUSES_COUNT, NUMBERS_IN_HOUSE } from '../../../constants'

const isValidCandidate = (candidateOccurencesCount, groupCandidatesCount) => {
    if (groupCandidatesCount === 2) return candidateOccurencesCount === groupCandidatesCount
    if (groupCandidatesCount === 3) return candidateOccurencesCount >= 2 && candidateOccurencesCount <= groupCandidatesCount
}

export const validCandidatesInHouseAndTheirLocations = (house, groupCandidatesCount, mainNumbers, notesData) => {
    const houseCells = getHouseCells(house)
    const candidatesHostCells = {}
    houseCells.forEach(cell => {
        if (isCellEmpty(cell, mainNumbers)) {
            const cellNotes = notesData[cell.row][cell.col]
            cellNotes.forEach(note => {
                if (note.show) {
                    const { noteValue } = note
                    if (!candidatesHostCells[noteValue]) candidatesHostCells[noteValue] = []
                    candidatesHostCells[noteValue].push(cell)
                }
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
    groupCells.forEach(({ row, col }) => {
        const cellNotes = notesData[row][col]
        cellNotes.forEach(({ show, noteValue }) => {
            if (show) candidates[noteValue] = true
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
    houseType,
    houseNum,
    notesData,
    maxHintsThreshold,
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
                house: { type: houseType, num: houseNum }, // TODO: remove the 'house' prefix from here
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
                    houseType,
                    houseNum,
                    notesData,
                    maxHintsThreshold,
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
