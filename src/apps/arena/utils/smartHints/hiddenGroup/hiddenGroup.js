import { N_CHOOSE_K } from '../../../../../resources/constants'
import { consoleLog, getBlockAndBoxNum, getRowAndCol } from '../../../../../utils/util'
import { HOUSE_TYPE } from '../../smartHint'
import { areSameBlockCells, areSameCells, areSameColCells, areSameRowCells, isCellEmpty } from '../../util'
import { SMART_HINTS_CELLS_BG_COLOR } from '../constants'

const getRowHouseCells = houseNum => {
    const result = []
    for (let col = 0; col < 9; col++) {
        result.push({ row: houseNum, col })
    }
    return result
}

const getColHouseCells = houseNum => {
    const result = []
    for (let row = 0; row < 9; row++) {
        result.push({ row, col: houseNum })
    }
    return result
}

const getBlockHouseCells = houseNum => {
    const result = []
    for (let box = 0; box < 9; box++) {
        result.push(getRowAndCol(houseNum, box))
    }
    return result
}

const getHouseCells = (houseType, houseNum) => {
    if (houseType === HOUSE_TYPE.ROW) return getRowHouseCells(houseNum)
    if (houseType === HOUSE_TYPE.COL) return getColHouseCells(houseNum)
    if (houseType === HOUSE_TYPE.BLOCK) return getBlockHouseCells(houseNum)
    console.log('@@@@@ @houseType', houseType)
    throw 'invalid house type'
}

const isValidCandidate = (candidateOccurencesCount, groupCandidatesCount) => {
    if (groupCandidatesCount === 2) return candidateOccurencesCount === groupCandidatesCount
    if (groupCandidatesCount === 3)
        return candidateOccurencesCount >= 2 && candidateOccurencesCount <= groupCandidatesCount
}

export const validCandidatesInHouseAndTheirLocations = (
    houseType,
    houseNum,
    groupCandidatesCount,
    mainNumbers,
    notesData,
) => {
    const houseCells = getHouseCells(houseType, houseNum)
    const candidatesHostCells = {}
    houseCells.forEach(cell => {
        if (isCellEmpty(cell, mainNumbers)) {
            const cellNotes = notesData[cell.row][cell.col]
            cellNotes.forEach(note => {
                if (note.show) {
                    const noteValue = note.noteValue
                    if (!candidatesHostCells[noteValue]) candidatesHostCells[noteValue] = []
                    candidatesHostCells[noteValue].push(cell)
                }
            })
        }
    })

    const result = []
    for (let candidate = 1; candidate <= 9; candidate++) {
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

const isCellExists = (cell, store) => store.some(storedCell => areSameCells(storedCell, cell))

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

const isGroupCellsExist = (newHiddenGroupCells, allHiddenGroups) => {
    return allHiddenGroups.some(({ groupCells: existingHiddenGroupCells }) => {
        return existingHiddenGroupCells.every((existingHiddenGroupCell, idx) => {
            return areSameCells(existingHiddenGroupCell, newHiddenGroupCells[idx])
        })
    })
}

const findHiddenGroupsFromValidCandidates = (validCandidates, groupCandidatesCount, houseType, houseNum, notesData) => {
    // TODO: put some thought into this condition here
    if (validCandidates.length > 6)
        throw `to many valid candidates in house for hidden ${groupCandidatesCount}. unicorn is here ??`

    const result = []
    const N = validCandidates.length
    const K = groupCandidatesCount

    N_CHOOSE_K[N][K].forEach(selection => {
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
            groupCells.length === groupCandidatesCount &&
            !isNakedGroup(groupCandidates.length, groupCells, notesData)
        ) {
            result.push({
                house: { type: houseType, num: houseNum }, // TODO: remove the 'house' prefix from here
                groupCandidates, // TODO: let's remove the 'group' prefix form here for both fields
                groupCells,
            })
        }
    })
    return result
}

const getAllHiddenGroups = (groupCandidatesCount, notesData, mainNumbers) => {
    const result = []
    const houseIterationOrder = [HOUSE_TYPE.BLOCK, HOUSE_TYPE.ROW, HOUSE_TYPE.COL]
    houseIterationOrder.forEach(houseType => {
        for (let houseNum = 0; houseNum < 9; houseNum++) {
            const validCandidatesWithLocations = validCandidatesInHouseAndTheirLocations(
                houseType,
                houseNum,
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
                )
                const newHiddenGroups = hiddenGroupsInHouse.filter(({ groupCells: hiddenGroupHostCells }) => {
                    return !isGroupCellsExist(hiddenGroupHostCells, result)
                })
                result.push(...newHiddenGroups)
            }
        }
    })

    // result.length && consoleLog(getGroupUIHighlightData(result[0], mainNumbers, notesData))

    return result
}

// TODO: put it in utils and see where else it can be used
const isRowOrColHouse = houseType => {
    return houseType === HOUSE_TYPE.ROW || houseType === HOUSE_TYPE.COL
}

const highlightHiddenGroups = (groupCandidatesCount, notesData, mainNumbers) => {
    const groupsRawData = getAllHiddenGroups(groupCandidatesCount, notesData, mainNumbers)

    consoleLog('@@@@@@@ groupsRawData', JSON.stringify(groupsRawData))

    const groupsUIHighlightData = groupsRawData.map(group => getGroupUIHighlightData(group, mainNumbers, notesData))

    return {
        present: groupsUIHighlightData.length,
        returnData: groupsUIHighlightData,
    }
}

/**  from here starts data preparation for UI  */
const getCellNotesHighlightData = (isPrimaryHouse, cellNotes, candidates) => {
    const result = {}

    // put these color in the color scheme and replace for naked group as well
    const NOTES_COLOR_SCHEME = {
        candidate: isPrimaryHouse ? 'green' : 'red',
        nonCandidate: isPrimaryHouse ? 'red' : '',
    }
    cellNotes.forEach(({ show, noteValue }) => {
        if (show) {
            const isGroupCandidate = candidates.includes(noteValue)
            result[noteValue] = {
                fontColor: isGroupCandidate ? NOTES_COLOR_SCHEME.candidate : NOTES_COLOR_SCHEME.nonCandidate,
            }
        }
    })
    return result
}

const highlightPrimaryHouseCells = (houseType, houseNum, candidates, groupHostCells, notesData, cellsToFocusData) => {
    const primaryHouseCells = getHouseCells(houseType, houseNum)
    primaryHouseCells.forEach(cell => {
        if (!cellsToFocusData[cell.row]) cellsToFocusData[cell.row] = {}
        cellsToFocusData[cell.row][cell.col] = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }

        const isHostCell = isCellExists(cell, groupHostCells)
        if (isHostCell) {
            const isPrimaryHouse = true
            cellsToFocusData[cell.row][cell.col].notesToHighlightData = getCellNotesHighlightData(
                isPrimaryHouse,
                notesData[cell.row][cell.col],
                candidates,
            )
        }
    })
}

const getSecondaryHostHouse = (primaryHouseType, groupHostCells) => {
    // TODO: nested ifs. can it be made linear or refactor into better readability ??
    let result = {}

    if (isRowOrColHouse(primaryHouseType) && areSameBlockCells(groupHostCells)) {
        result = {
            type: HOUSE_TYPE.BLOCK,
            num: getBlockAndBoxNum(groupHostCells[0]).blockNum,
        }
    } else if (primaryHouseType === HOUSE_TYPE.BLOCK) {
        if (areSameRowCells(groupHostCells)) {
            result = {
                type: HOUSE_TYPE.ROW,
                num: groupHostCells[0].row,
            }
        } else if (areSameColCells(groupHostCells)) {
            result = {
                type: HOUSE_TYPE.COL,
                num: groupHostCells[0].col,
            }
        }
    }

    return result
}

const shouldHighlightSecondaryHouseCells = (houseCells, groupHostCells, groupCandidates, mainNumbers, notesData) => {
    return houseCells.some(cell => {
        if (!isCellEmpty(cell, mainNumbers)) return false
        if (isCellExists(cell, groupHostCells)) return false
        return groupCandidates.some(groupCandidate => {
            return notesData[cell.row][cell.col][groupCandidate - 1].show
        })
    })
}

const highlightSecondaryHouseCells = (
    houseCells,
    groupHostCells,
    groupCandidates,
    mainNumbers,
    notesData,
    cellsToFocusData,
) => {
    houseCells.forEach(cell => {
        const isHostCell = isCellExists(cell, groupHostCells)
        if (!isHostCell) {
            if (!cellsToFocusData[cell.row]) cellsToFocusData[cell.row] = {}
            cellsToFocusData[cell.row][cell.col] = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            if (isCellEmpty(cell, mainNumbers)) {
                const isPrimaryHouse = false
                cellsToFocusData[cell.row][cell.col].notesToHighlightData = getCellNotesHighlightData(
                    isPrimaryHouse,
                    notesData[cell.row][cell.col],
                    groupCandidates,
                )
            }
        }
    })
}

const getGroupUIHighlightData = (group, mainNumbers, notesData) => {
    const {
        house: { type: houseType, num: houseNum },
        groupCandidates: candidates,
        groupCells: hostCells,
    } = group

    const cellsToFocusData = {}

    highlightPrimaryHouseCells(houseType, houseNum, candidates, hostCells, notesData, cellsToFocusData)

    const secondaryHostHouse = getSecondaryHostHouse(houseType, hostCells)
    // TODO: add a utility to check if the returned object is empty or not for cases like this
    let secondaryHouseEligibleForHighlight
    if (secondaryHostHouse.type) {
        const secondaryHouseCells = getHouseCells(secondaryHostHouse.type, secondaryHostHouse.num)
        // TODO: this logic is of eligibility check for highlighting secondary house cells is wrong
        // will come up with the usecase for it later
        secondaryHouseEligibleForHighlight = shouldHighlightSecondaryHouseCells(
            secondaryHouseCells,
            hostCells,
            candidates,
            mainNumbers,
            notesData,
        )
        if (secondaryHouseEligibleForHighlight)
            highlightSecondaryHouseCells(
                secondaryHouseCells,
                hostCells,
                candidates,
                mainNumbers,
                notesData,
                cellsToFocusData,
            )
    }

    const getExplaination = () => {
        const primaryHouseType = houseType

        const getCandidatesListForMessage = () => {
            if (candidates.length === 2) return `${candidates[0]} and ${candidates[1]}`
            return `${candidates[0]}, ${candidates[1]} and ${candidates[2]}`
        }

        const hiddenType = candidates.length === 2 ? 'Hidden Double' : 'Hidden Tripple'

        const candidatesCountText = candidates.length === 2 ? 'two' : 'three'
        const groupCellsCountText = candidatesCountText

        const getSecondaryHouseNotesEliminationMsg = () => {
            if (!secondaryHouseEligibleForHighlight) return ''
            return ` Since the cells where ${hiddenType} is formed are also the part of the highlighted ${
                secondaryHostHouse.type
            }. Now because ${getCandidatesListForMessage()} will be present in one of these ${groupCellsCountText} cells for sure (which is which is yet unknown). We can remove ${getCandidatesListForMessage()} highlighted in red color in this ${
                secondaryHostHouse.type
            }.`
        }

        return `In the highlighted ${primaryHouseType}, ${candidatesCountText} numbers ${getCandidatesListForMessage()} highlighted in green color are present only in ${groupCellsCountText} cells. this arrangement forms a ${hiddenType}, so in this ${primaryHouseType} no other candidate can appear in the cells where ${getCandidatesListForMessage()} are present and the numbers highlighted in red color in these cells can be removed safely.${getSecondaryHouseNotesEliminationMsg()}`
    }

    return {
        cellsToFocusData,
        techniqueInfo: {
            title: group.groupCandidates.length === 2 ? 'Hidden Double' : 'Hidden Tripple',
            logic: getExplaination(),
        },
    }
}

export { getAllHiddenGroups, highlightHiddenGroups }
