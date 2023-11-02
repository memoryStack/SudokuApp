import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _filter from '@lodash/filter'
import _forEach from '@lodash/forEach'
import _isEmpty from '@lodash/isEmpty'
import _some from '@lodash/some'

import { NotesRecord } from '../../../../RecordUtilities/boardNotes'
import {
    getCellsCommonHousesInfo,
    getHousesCellsSharedByCells, getUniqueNotesFromCells, isCellExists,
} from '../../../util'

import { HINTS_IDS, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, HOUSE_TYPE_VS_FULL_NAMES } from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import {
    setCellDataInHintResult,
    getCandidatesListText,
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
    transformCellBGColor,
} from '../../util'
import { NAKED_DOUBLE_CANDIDATES_COUNT } from '../../nakedGroup/nakedGroup.constants'

import { getCellsAxesValuesListText } from '../helpers'
import { BOARD_MOVES_TYPES } from '../../../../constants'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { NakedGroupTransformerArgs } from './types'
import {
    CellHighlightData, NotesRemovalHintAction, NotesToHighlightData, SmartHintsColorSystem, TransformedRawHint,
} from '../../types'
import { getHouseNumText } from '../xWing/transformers/helpers'

export const transformNakedGroupRawHint = ({ rawHint, notesData, smartHintsColorSystem }: NakedGroupTransformerArgs): TransformedRawHint => {
    const { groupCells } = rawHint
    const focusedCells = getHousesCellsSharedByCells(groupCells)
    const groupCandidates = getUniqueNotesFromCells(groupCells, notesData)

    return {
        hasTryOut: true,
        cellsToFocusData: getCellsHighlightData(focusedCells, groupCells, groupCandidates, notesData, smartHintsColorSystem),
        focusedCells,
        type: getHintId(groupCandidates),
        title: HINT_ID_VS_TITLES[getHintId(groupCandidates)],
        steps: getHintExplanationStepsFromHintChunks(getHintChunks(groupCandidates, groupCells)),
        applyHint: getApplyHintData(focusedCells, groupCells, groupCandidates, notesData),
        clickableCells: [...groupCells, ...getRemovableNotesCells(groupCells, groupCandidates, focusedCells, notesData)],
        unclickableCellClickInTryOutMsg: `you can select cells which have ${getCandidatesListText(groupCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.OR)} candidate highlighted in green or red color`,
        tryOutAnalyserData: {
            groupCandidates,
            focusedCells,
            groupCells,
        },
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(groupCandidates) as InputPanelVisibleNumbers,
    }
}

const getRemovableNotesCells = (groupCells :Cell[], groupCandidates: NoteValue[], focusedCells: Cell[], notesData: Notes) => _filter(focusedCells, (cell: Cell) => {
    if (isCellExists(cell, groupCells)) return false
    return _some(groupCandidates, (groupCandidate: NoteValue) => NotesRecord.isNotePresentInCell(notesData, groupCandidate, cell))
})

const getCellsHighlightData = (
    cells: Cell[],
    groupCells: Cell[],
    groupCandidates: NoteValue[],
    notesData: Notes,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    const result = {}

    cells.forEach(cell => {
        const cellHighlightData: CellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }

        const notesToHighlightData: NotesToHighlightData = {}
        let notesWillBeHighlighted = false
        groupCandidates.forEach(groupCandidate => {
            if (NotesRecord.isNotePresentInCell(notesData, groupCandidate, cell)) {
                if (isCellExists(cell, groupCells)) {
                    notesToHighlightData[groupCandidate] = { fontColor: smartHintColorSystemReader.safeNoteColor(smartHintsColorSystem) }
                } else {
                    notesToHighlightData[groupCandidate] = { fontColor: smartHintColorSystemReader.toBeRemovedNoteColor(smartHintsColorSystem) }
                }
                notesWillBeHighlighted = true
            }
        })

        if (notesWillBeHighlighted) cellHighlightData.notesToHighlightData = notesToHighlightData
        setCellDataInHintResult(cell, cellHighlightData, result)
    })

    return result
}

const getHostHousesText = (groupCells: Cell[]) => {
    const commonHouses = getCellsCommonHousesInfo(groupCells)
    return commonHouses.map(commonHouse => `${getHouseNumText(commonHouse)} ${HOUSE_TYPE_VS_FULL_NAMES[commonHouse.type].FULL_NAME}`)
        .join(` ${HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND} `)
}

const getHintChunks = (groupCandidates: NoteValue[], groupCells: Cell[]) => {
    const msgPlaceholdersValues = {
        candidatesListTextAndConcatenated: getCandidatesListText(
            groupCandidates,
            HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND,
        ),
        candidatesListTextOrConcatenated: getCandidatesListText(
            groupCandidates,
            HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.OR,
        ),
        groupCellsText: getCellsAxesValuesListText(groupCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        hostHouses: getHostHousesText(groupCells),
    }
    return (HINT_EXPLANATION_TEXTS[getHintId(groupCandidates)] as string[])
        .map(hintChunkTemplate => dynamicInterpolation(hintChunkTemplate, msgPlaceholdersValues))
}

const getHintId = (groupCandidates: NoteValue[]) => (groupCandidates.length === NAKED_DOUBLE_CANDIDATES_COUNT ? HINTS_IDS.NAKED_DOUBLE : HINTS_IDS.NAKED_TRIPPLE)

const getApplyHintData = (
    focusedCells: Cell[],
    groupCells: Cell[],
    groupCandidates: NoteValue[],
    notesData: Notes,
) => {
    const result: NotesRemovalHintAction[] = []

    const cellsWithoutGroupCells = _filter(focusedCells, (cell: Cell) => !isCellExists(cell, groupCells))

    _forEach(cellsWithoutGroupCells, (cell: Cell) => {
        const groupCandidatesVisible = _filter(groupCandidates, (groupCandidate: NoteValue) => NotesRecord.isNotePresentInCell(notesData, groupCandidate, cell))
        if (!_isEmpty(groupCandidatesVisible)) {
            result.push({
                cell,
                action: { type: BOARD_MOVES_TYPES.REMOVE, notes: groupCandidatesVisible },
            })
        }
    })

    return result
}
