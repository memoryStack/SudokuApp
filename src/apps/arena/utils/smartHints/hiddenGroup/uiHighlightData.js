import { getBlockAndBoxNum } from '../../../../../utils/util'
import { HOUSE_TYPE } from '../../smartHint'
import { areSameBlockCells, areSameColCells, areSameRowCells, isCellEmpty, isCellExists } from '../../util'
import { SMART_HINTS_CELLS_BG_COLOR } from '../constants'
import { getHouseCells } from '../../houseCells'
import { HIDDEN_GROUP_TYPE, NUMBER_TO_TEXT } from '../constants'

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

// TODO: put it in utils and see where else it can be used
const isRowOrColHouse = houseType => {
    return houseType === HOUSE_TYPE.ROW || houseType === HOUSE_TYPE.COL
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

const getGroupCandidatesListForMessage = candidates => {
    if (candidates.length === 2) return `${candidates[0]} and ${candidates[1]}`
    return `${candidates[0]}, ${candidates[1]} and ${candidates[2]}`
}

const getSecondaryHouseHintExplaination = (houseType, groupCandidates) => {
    const candidatesCount = groupCandidates.length
    return ` Since the cells where ${
        HIDDEN_GROUP_TYPE[candidatesCount]
    } is formed are also the part of the highlighted ${houseType}. Now because ${getGroupCandidatesListForMessage(
        groupCandidates,
    )} will be present in one of these ${
        NUMBER_TO_TEXT[candidatesCount]
    } cells for sure (which is which is yet unknown). We can remove ${getGroupCandidatesListForMessage(
        groupCandidates,
    )} highlighted in red color in this ${houseType}.`
}

const getPrimaryHouseHintExplaination = (houseType, groupCandidates) => {
    const candidatesCount = groupCandidates.length
    return `In the highlighted ${houseType}, ${
        NUMBER_TO_TEXT[candidatesCount]
    } numbers ${getGroupCandidatesListForMessage(groupCandidates)} highlighted in green color are present only in ${
        NUMBER_TO_TEXT[candidatesCount]
    } cells. this arrangement forms a ${
        HIDDEN_GROUP_TYPE[candidatesCount]
    }, so in this ${houseType} no other candidate can appear in the cells where ${getGroupCandidatesListForMessage(
        groupCandidates,
    )} are present and the numbers highlighted in red color in these cells can be removed safely.`
}

// export it
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

    const primaryHouseNotesEliminationLogic = getPrimaryHouseHintExplaination(houseType, candidates)
    const secondaryHouseNotesEliminationLogic = secondaryHouseEligibleForHighlight
        ? getSecondaryHouseHintExplaination(secondaryHostHouse.type, candidates)
        : ''

    return {
        cellsToFocusData,
        techniqueInfo: {
            title: HIDDEN_GROUP_TYPE[group.groupCandidates.length],
            logic: primaryHouseNotesEliminationLogic + secondaryHouseNotesEliminationLogic,
        },
    }
}

export { getGroupUIHighlightData }