import _cloneDeep from '@lodash/cloneDeep'
import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'
import _isEmpty from '@lodash/isEmpty'
import _filter from '@lodash/filter'
import _unique from '@lodash/unique'
import _sortNumbers from '@lodash/sortNumbers'

import { NotesRecord } from '../../../../RecordUtilities/boardNotes'
import { MainNumbersRecord } from '../../../../RecordUtilities/boardMainNumbers'

import {
    HINTS_IDS, HOUSE_TYPE, HOUSE_TYPE_VS_FULL_NAMES,
} from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import {
    areSameBlockCells,
    areSameColCells,
    areSameRowCells,
    getCellAxesValues,
    isCellExists,
} from '../../../util'

import { getHouseCells } from '../../../houseCells'
import { getCellsAxesValuesListText } from '../helpers'
import {
    getHintExplanationStepsFromHintChunks,
    setCellDataInHintResult,
    getTryOutInputPanelNumbersVisibility,
    removeDuplicteCells,
    getCandidatesListText,
    transformCellBGColor,
} from '../../util'
import { BOARD_MOVES_TYPES } from '../../../../constants'
import { Houses } from '../../../classes/houses'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { getBlockAndBoxNum } from '../../../cellTransformers'

export const getRemovableCandidates = (hostCells, groupCandidates, notesData) => {
    const result = []
    hostCells.forEach(cell => {
        const cellRemovableNotes = NotesRecord.getCellNotes(notesData, cell)
            .filter(({ show, noteValue }) => show && !groupCandidates.includes(noteValue))
            .map(({ noteValue }) => noteValue)
        result.push(...cellRemovableNotes)
    })

    return _sortNumbers(_unique(result))
}

const getCellNotesHighlightData = (isPrimaryHouse, cellNotes, groupCandidates, smartHintsColorSystem) => {
    const result = {}
    const NOTES_COLOR_SCHEME = {
        candidate: isPrimaryHouse ? smartHintColorSystemReader.safeNoteColor(smartHintsColorSystem) : smartHintColorSystemReader.toBeRemovedNoteColor(smartHintsColorSystem),
        nonCandidate: isPrimaryHouse ? smartHintColorSystemReader.toBeRemovedNoteColor(smartHintsColorSystem) : '',
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

const highlightPrimaryHouseCells = (house, groupCandidates, groupHostCells, notesData, cellsToFocusData, smartHintsColorSystem) => {
    const primaryHouseCells = getHouseCells(house)
    primaryHouseCells.forEach(cell => {
        const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
        const isHostCell = isCellExists(cell, groupHostCells)
        if (isHostCell) {
            const isPrimaryHouse = true
            cellHighlightData.notesToHighlightData = getCellNotesHighlightData(
                isPrimaryHouse,
                NotesRecord.getCellNotes(notesData, cell),
                groupCandidates,
                smartHintsColorSystem,
            )
        }
        // TODO: improve the naming of this func
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
    })
}

const isRowOrColHouse = houseType => Houses.isRowHouse(houseType) || Houses.isColHouse(houseType)

const getSecondaryHostHouse = (primaryHouseType, groupHostCells) => {
    // TODO: nested ifs. can it be made linear or refactor into better readability ??
    let result = {}

    if (isRowOrColHouse(primaryHouseType) && areSameBlockCells(groupHostCells)) {
        result = {
            type: HOUSE_TYPE.BLOCK,
            num: getBlockAndBoxNum(groupHostCells[0]).blockNum,
        }
    } else if (Houses.isBlockHouse(primaryHouseType)) {
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

const shouldHighlightSecondaryHouseCells = (houseCells, groupHostCells, groupCandidates, mainNumbers, notesData) => houseCells.some(cell => {
    if (MainNumbersRecord.isCellFilled(mainNumbers, cell)) return false
    if (isCellExists(cell, groupHostCells)) return false
    return groupCandidates.some(groupCandidate => NotesRecord.isNotePresentInCell(notesData, groupCandidate, cell))
})

const highlightSecondaryHouseCells = (
    houseCells,
    groupHostCells,
    groupCandidates,
    mainNumbers,
    notesData,
    cellsToFocusData,
    smartHintsColorSystem,
) => {
    houseCells.forEach(cell => {
        const isHostCell = isCellExists(cell, groupHostCells)
        if (!isHostCell) {
            const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
            if (!MainNumbersRecord.isCellFilled(mainNumbers, cell)) {
                const isPrimaryHouse = false
                cellHighlightData.notesToHighlightData = getCellNotesHighlightData(
                    isPrimaryHouse,
                    NotesRecord.getCellNotes(notesData, cell),
                    groupCandidates,
                    smartHintsColorSystem,
                )
            }
            setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
        }
    })
}

const getHintChunks = (houseType, groupCandidates, groupCells) => {
    const hintId = groupCandidates.length === 2 ? HINTS_IDS.HIDDEN_DOUBLE : HINTS_IDS.HIDDEN_TRIPPLE
    const msgTemplates = HINT_EXPLANATION_TEXTS[hintId]
    const msgPlaceholdersValues = {
        houseType: HOUSE_TYPE_VS_FULL_NAMES[houseType].FULL_NAME,
        candidatesListText: getCandidatesListText(groupCandidates),
        groupCellsText: getCellsAxesValuesListText(groupCells),
    }
    return msgTemplates.map(msgTemplate => dynamicInterpolation(msgTemplate, msgPlaceholdersValues))
}

const getTryOutInputPanelAllowedCandidates = (groupCandidates, hostCells, notes) => {
    const removableCandidates = getRemovableCandidates(hostCells, groupCandidates, notes)
    return _sortNumbers([...groupCandidates, ...removableCandidates])
}

const getRemovableGroupCandidatesHostCellsRestrictedNumberInputs = (
    removableGroupCandidatesHostCells,
    groupCandidates,
    notes,
) => removableGroupCandidatesHostCells.reduce((prevValue, cell) => {
    const result = { ...prevValue }
    const restrictedInputsForCell = NotesRecord.getCellNotes(notes, cell)
        .filter(({ show, noteValue }) => show && !groupCandidates.includes(noteValue))
        .map(({ noteValue }) => noteValue)
    if (restrictedInputsForCell.length) {
        result[getCellAxesValues(cell)] = restrictedInputsForCell
    }
    return result
}, {})

const getApplyHintData = (groupCandidates, groupHostCells, removableGroupCandidatesHostCells, notesData) => {
    const result = []

    _forEach(groupHostCells, cell => {
        const notesToRemove = NotesRecord.getCellVisibleNotesList(notesData, cell)
            .filter(note => !groupCandidates.includes(note))
        result.push({
            cell,
            action: { type: BOARD_MOVES_TYPES.REMOVE, notes: notesToRemove },
        })
    })

    _forEach(removableGroupCandidatesHostCells, cell => {
        const visibleGroupCandidatesInCell = _filter(groupCandidates, groupCandidate => NotesRecord.isNotePresentInCell(notesData, groupCandidate, cell))

        result.push({
            cell,
            action: { type: BOARD_MOVES_TYPES.REMOVE, notes: visibleGroupCandidatesInCell },
        })
    })

    return result
}

export const transformHiddenGroupRawHint = ({
    rawHint: group, mainNumbers, notesData, smartHintsColorSystem,
}) => {
    const { house, groupCandidates, groupCells: hostCells } = group

    const cellsToFocusData = {}

    highlightPrimaryHouseCells(house, groupCandidates, hostCells, notesData, cellsToFocusData, smartHintsColorSystem)

    let focusedCells = getHouseCells(house)
    let removableGroupCandidatesHostCells = []
    const secondaryHostHouse = getSecondaryHostHouse(house.type, hostCells)
    let secondaryHouseEligibleForHighlight
    if (!_isEmpty(secondaryHostHouse)) {
        const secondaryHouseCells = getHouseCells(secondaryHostHouse)
        // TODO: this logic is of eligibility check for highlighting secondary house cells is wrong
        // will come up with the usecase for it later
        secondaryHouseEligibleForHighlight = shouldHighlightSecondaryHouseCells(
            secondaryHouseCells,
            hostCells,
            groupCandidates,
            mainNumbers,
            notesData,
        )
        if (secondaryHouseEligibleForHighlight) {
            highlightSecondaryHouseCells(
                secondaryHouseCells,
                hostCells,
                groupCandidates,
                mainNumbers,
                notesData,
                cellsToFocusData,
                smartHintsColorSystem,
            )
        }
        focusedCells.push(...secondaryHouseCells)
        focusedCells = removeDuplicteCells(focusedCells)

        removableGroupCandidatesHostCells = secondaryHouseCells.filter(cell => {
            if (isCellExists(cell, hostCells)) return false
            return groupCandidates.some(groupCandidate => NotesRecord.isNotePresentInCell(notesData, groupCandidate, cell))
        })
    }

    const hintChunks = getHintChunks(house.type, groupCandidates, hostCells)

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
        applyHint: getApplyHintData(groupCandidates, hostCells, removableGroupCandidatesHostCells, notesData),
        tryOutAnalyserData: {
            groupCandidates,
            focusedCells,
            groupCells: hostCells,
            removableCandidates: getRemovableCandidates(hostCells, groupCandidates, notesData),
            removableGroupCandidatesHostCells,
            primaryHouse: group.house,
        },
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(tryOutInputPanelAllowedCandidates),
        clickableCells: _cloneDeep([...hostCells, ...removableGroupCandidatesHostCells]),
        cellsRestrictedNumberInputs: getRemovableGroupCandidatesHostCellsRestrictedNumberInputs(
            removableGroupCandidatesHostCells,
            groupCandidates,
            notesData,
        ),
        restrictedNumberInputMsg:
            'input the numbers which are highlighted in red color in this cell. other numbers don\'t help in learning this hint.',
    }
}
