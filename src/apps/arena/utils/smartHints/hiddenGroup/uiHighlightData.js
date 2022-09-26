import { onlyUnique } from '../../../../../utils/util'
import cloneDeep from 'lodash/src/utils/cloneDeep'
import { HINTS_IDS, HOUSE_TYPE, HOUSE_TYPE_VS_FULL_NAMES } from '../../smartHints/constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../smartHints/stringLiterals'
import {
    areSameBlockCells,
    areSameColCells,
    areSameRowCells,
    getBlockAndBoxNum,
    getCellAxesValues,
    isCellEmpty,
    isCellExists,
    isCellNoteVisible,
} from '../../util'
import { SMART_HINTS_CELLS_BG_COLOR } from '../constants'
import { getHouseCells } from '../../houseCells'
import {
    getHintExplanationStepsFromHintChunks,
    setCellDataInHintResult,
    getTryOutInputPanelNumbersVisibility,
    removeDuplicteCells,
    getCandidatesListText,
} from '../util'
import { getCellsAxesValuesListText } from '../tryOutInputAnalyser/helpers'
import { dynamicInterpolation } from 'lodash/src/utils/dynamicInterpolation'

export const getRemovableCandidates = (hostCells, groupCandidates, notesData) => {
    const result = []
    hostCells.forEach(cell => {
        const cellNotes = notesData[cell.row][cell.col]
        const cellRemovableNotes = cellNotes
            .filter(({ show, noteValue }) => {
                return show && !groupCandidates.includes(noteValue)
            })
            .map(({ noteValue }) => {
                return noteValue
            })
        result.push(...cellRemovableNotes)
    })
    return result.filter(onlyUnique).sort()
}

const getCellNotesHighlightData = (isPrimaryHouse, cellNotes, groupCandidates) => {
    const result = {}

    // put these color in the color scheme and replace for naked group as well
    const NOTES_COLOR_SCHEME = {
        candidate: isPrimaryHouse ? 'green' : 'red',
        nonCandidate: isPrimaryHouse ? 'red' : '',
    }
    cellNotes.forEach(({ show, noteValue }) => {
        if (show) {
            const isGroupCandidate = groupCandidates.includes(noteValue)
            result[noteValue] = {
                fontColor: isGroupCandidate ? NOTES_COLOR_SCHEME.candidate : NOTES_COLOR_SCHEME.nonCandidate,
            }
        }
    })
    return result
}

const highlightPrimaryHouseCells = (
    houseType,
    houseNum,
    groupCandidates,
    groupHostCells,
    notesData,
    cellsToFocusData,
) => {
    const primaryHouseCells = getHouseCells(houseType, houseNum)
    primaryHouseCells.forEach(cell => {
        const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
        const isHostCell = isCellExists(cell, groupHostCells)
        if (isHostCell) {
            const isPrimaryHouse = true
            cellHighlightData.notesToHighlightData = getCellNotesHighlightData(
                isPrimaryHouse,
                notesData[cell.row][cell.col],
                groupCandidates,
            )
        }
        // TODO: improve the naming of this func
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
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
            const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            if (isCellEmpty(cell, mainNumbers)) {
                const isPrimaryHouse = false
                cellHighlightData.notesToHighlightData = getCellNotesHighlightData(
                    isPrimaryHouse,
                    notesData[cell.row][cell.col],
                    groupCandidates,
                )
            }
            setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
        }
    })
}

const getRemovableGroupCandidates = (groupCandidates, removableGroupCandidatesHostCells, notesData) => {
    return removableGroupCandidatesHostCells
        .reduce((prevValue, cell) => {
            const cellNotes = notesData[cell.row][cell.col]
            const groupCandidatesPresentInCell = groupCandidates.filter(groupCandidate => {
                return isCellNoteVisible(groupCandidate, cellNotes)
            })
            return [...prevValue, ...groupCandidatesPresentInCell]
        }, [])
        .filter(onlyUnique)
        .sort()
}

const getPrimaryHouseHintExplaination = (houseType, groupCandidates, groupCells, removableCandidates) => {
    const isHiddenDoubles = groupCandidates.length === 2
    const msgPlaceholdersValues = {
        houseName: HOUSE_TYPE_VS_FULL_NAMES[houseType].FULL_NAME,
        candidatesCountText: isHiddenDoubles ? 'two' : 'three', // TODO: do something with it
        cellsCountText: isHiddenDoubles ? 'two' : 'three',
        candidatesListText: getCandidatesListText(groupCandidates),
        cellsListText: getCellsAxesValuesListText(groupCells),
        removableCandidatesListText: getCandidatesListText(removableCandidates),
    }
    const hintId = isHiddenDoubles ? HINTS_IDS.HIDDEN_DOUBLE : HINTS_IDS.HIDDEN_TRIPPLE
    const msgTemplate = HINT_EXPLANATION_TEXTS[hintId].PRIMARY_HOUSE
    return dynamicInterpolation(msgTemplate, msgPlaceholdersValues)
}

const getSecondaryHouseHintExplaination = (
    houseType,
    groupCandidates,
    groupCells,
    removableCandidates,
    removableGroupCandidatesHostCells,
    notes,
) => {
    const isHiddenDouble = groupCandidates.length === 2
    const removableGroupCandidatesListText = getCandidatesListText(
        getRemovableGroupCandidates(groupCandidates, removableGroupCandidatesHostCells, notes),
    )
    const msgPlaceholdersValues = {
        removableCandidatesListText: getCandidatesListText(removableCandidates),
        groupCellsAxesListText: getCellsAxesValuesListText(groupCells),
        houseName: HOUSE_TYPE_VS_FULL_NAMES[houseType].FULL_NAME,
        candidatesListText: getCandidatesListText(groupCandidates),
        complementaryHintTitle: isHiddenDouble
            ? HINT_ID_VS_TITLES[HINTS_IDS.NAKED_DOUBLE]
            : HINT_ID_VS_TITLES[HINTS_IDS.NAKED_TRIPPLE],
        removableGroupCandidatesListText,
        removableGroupCandidatesHostCellsListText: getCellsAxesValuesListText(removableGroupCandidatesHostCells),
    }

    const hintId = isHiddenDouble ? HINTS_IDS.HIDDEN_DOUBLE : HINTS_IDS.HIDDEN_TRIPPLE
    const msgTemplate = HINT_EXPLANATION_TEXTS[hintId].SECONDARY_HOUSE
    return dynamicInterpolation(msgTemplate, msgPlaceholdersValues)
}

const getTryOutInputPanelAllowedCandidates = (groupCandidates, hostCells, notes) => {
    const removableCandidates = getRemovableCandidates(hostCells, groupCandidates, notes)
    return [...groupCandidates, ...removableCandidates].sort()
}

const getRemovableGroupCandidatesHostCellsRestrictedNumberInputs = (
    removableGroupCandidatesHostCells,
    groupCandidates,
    notes,
) => {
    return removableGroupCandidatesHostCells.reduce((prevValue, cell) => {
        const restrictedInputsForCell = notes[cell.row][cell.col]
            .filter(({ show, noteValue }) => {
                return show && !groupCandidates.includes(noteValue)
            })
            .map(({ noteValue }) => noteValue)
        if (restrictedInputsForCell.length) {
            prevValue[getCellAxesValues(cell)] = restrictedInputsForCell
        }
        return prevValue
    }, {})
}

const getGroupUIHighlightData = (group, mainNumbers, notesData) => {
    const {
        house: { type: houseType, num: houseNum },
        groupCandidates: groupCandidates,
        groupCells: hostCells,
    } = group

    const cellsToFocusData = {}

    highlightPrimaryHouseCells(houseType, houseNum, groupCandidates, hostCells, notesData, cellsToFocusData)

    let focusedCells = getHouseCells(houseType, houseNum)
    let removableGroupCandidatesHostCells = []
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
            groupCandidates,
            mainNumbers,
            notesData,
        )
        if (secondaryHouseEligibleForHighlight)
            highlightSecondaryHouseCells(
                secondaryHouseCells,
                hostCells,
                groupCandidates,
                mainNumbers,
                notesData,
                cellsToFocusData,
            )
        focusedCells.push(...secondaryHouseCells)
        focusedCells = removeDuplicteCells(focusedCells)

        removableGroupCandidatesHostCells = secondaryHouseCells.filter(cell => {
            if (isCellExists(cell, hostCells)) return false
            return groupCandidates.some(groupCandidate => {
                return isCellNoteVisible(groupCandidate, notesData[cell.row][cell.col])
            })
        })
    }

    const removableCandidates = getRemovableCandidates(hostCells, groupCandidates, notesData)
    const hintChunks = [getPrimaryHouseHintExplaination(houseType, groupCandidates, hostCells, removableCandidates)]
    if (secondaryHouseEligibleForHighlight) {
        hintChunks.push(
            getSecondaryHouseHintExplaination(
                secondaryHostHouse.type,
                groupCandidates,
                hostCells,
                removableCandidates,
                removableGroupCandidatesHostCells,
                notesData,
            ),
        )
    }

    const isHiddenDoubles = groupCandidates.length === 2
    const tryOutInputPanelAllowedCandidates = getTryOutInputPanelAllowedCandidates(
        groupCandidates,
        hostCells,
        notesData,
    )

    return {
        hasTryOut: true,
        type: isHiddenDoubles ? HINTS_IDS.HIDDEN_DOUBLE : HINTS_IDS.HIDDEN_TRIPPLE,
        title: isHiddenDoubles
            ? HINT_ID_VS_TITLES[HINTS_IDS.HIDDEN_DOUBLE]
            : HINT_ID_VS_TITLES[HINTS_IDS.HIDDEN_TRIPPLE],
        steps: getHintExplanationStepsFromHintChunks(hintChunks),
        cellsToFocusData,
        focusedCells,
        tryOutAnalyserData: {
            groupCandidates,
            focusedCells,
            groupCells: hostCells,
            removableCandidates,
            removableGroupCandidatesHostCells,
            primaryHouse: group.house,
        },
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(tryOutInputPanelAllowedCandidates),
        clickableCells: cloneDeep([...hostCells, ...removableGroupCandidatesHostCells]),
        cellsRestrictedNumberInputs: getRemovableGroupCandidatesHostCellsRestrictedNumberInputs(
            removableGroupCandidatesHostCells,
            groupCandidates,
            notesData,
        ),
        restrictedNumberInputMsg:
            "input the numbers which are highlighted in red color in this cell. other numbers don't help in learning this hint.",
    }
}

export { getGroupUIHighlightData }
