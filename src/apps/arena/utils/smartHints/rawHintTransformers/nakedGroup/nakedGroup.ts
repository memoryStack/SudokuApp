import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _filter from '@lodash/filter'
import _forEach from '@lodash/forEach'
import _isEmpty from '@lodash/isEmpty'
import _some from '@lodash/some'

import _isNil from '@lodash/isNil'
import _intersection from '@lodash/intersection'
import { NotesRecord } from '@domain/board/records/notesRecord'
import {
    getAllCellsInHousesUniquely,
    getCellsCommonHousesInfo,
    getHousesCellsSharedByCells, getUniqueNotesFromCells, isCellExists, sortCells,
} from '../../../util'

import { HINTS_IDS, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, HOUSE_TYPE_VS_FULL_NAMES } from '../../constants'
import { HintExplainationTexts, HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import { NakedGroupTransformerArgs } from './types'
import {
    CellHighlightData, NotesRemovalHintAction, NotesToHighlightData, RemovableNotesInfo, SmartHintsColorSystem, SmartHintsTranslationsTexts, TransformedRawHint,
} from '../../types'
import { isCellPresentInHouse } from '@domain/board/utils/housesAndCells'
import {
    setCellDataInHintResult,
    getCandidatesListText,
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
    transformCellBGColor,
    getAxisValuesFromTranslations,
    getLanguageSpecificHouseListText,
} from '../../util'
import { NAKED_DOUBLE_CANDIDATES_COUNT } from '../../nakedGroup/nakedGroup.constants'
import { getCellsAxesValuesListText, getHouseNumText } from '../helpers'
import { BOARD_MOVES_TYPES } from '../../../../constants'
import smartHintColorSystemReader from '../../colorSystem.reader'

export const transformNakedGroupRawHint = ({ rawHint, notesData, smartHintsColorSystem, smartHintsTranslationsTexts }: NakedGroupTransformerArgs): TransformedRawHint => {
    const { groupCells } = rawHint
    const groupCandidates = getUniqueNotesFromCells(groupCells, notesData)
    const focusedCells = getHighlightableCells(groupCells, groupCandidates, notesData)
    const removableNotesHostCells = getRemovableNotesCells(groupCells, groupCandidates, notesData)
    const hostHouses = getHostHouses(groupCells, groupCandidates, notesData)
    return {
        hasTryOut: true,
        cellsToFocusData: getCellsHighlightData(focusedCells, groupCells, groupCandidates, notesData, smartHintsColorSystem),
        focusedCells,
        type: getHintId(groupCandidates),
        title: smartHintsTranslationsTexts.title[getHintId(groupCandidates)],
        steps: getHintExplanationStepsFromHintChunks(
            getHintChunks(groupCandidates, groupCells, hostHouses, smartHintsTranslationsTexts)
        ),
        applyHint: getApplyHintData(focusedCells, groupCells, groupCandidates, notesData),
        clickableCells: [...groupCells, ...removableNotesHostCells],
        unclickableCellClickInTryOutMsg: `you can select cells which have ${getCandidatesListText(groupCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.OR)} candidate highlighted in green or red color`,
        removableNotes: getRemovableNotesHostCellsMap(groupCandidates, removableNotesHostCells, notesData),
        tryOutAnalyserData: {
            groupCandidates,
            focusedCells,
            groupCells,
        },
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(groupCandidates) as InputPanelVisibleNumbers,
    }
}

const getHighlightableCells = (
    groupCells: Cell[],
    groupCandidates: NoteValue[],
    notesData: Notes
) => {
    const hostHouses = getHostHouses(groupCells, groupCandidates, notesData)
    return getAllCellsInHousesUniquely(hostHouses)
}

const getHostHouses = (
    groupCells: Cell[],
    groupCandidates: NoteValue[],
    notesData: Notes
) => {
    const commonHouses = getCellsCommonHousesInfo(groupCells)
    if (commonHouses.length === 1) return commonHouses
    const removableNotesHostCells = getRemovableNotesCells(groupCells, groupCandidates, notesData)

    return commonHouses.filter((possibleHostHouse) => {
        return removableNotesHostCells.some((cell: Cell) => {
            return isCellPresentInHouse(cell, possibleHostHouse)
        })
    })
}

const getRemovableNotesCells = (
    groupCells: Cell[],
    groupCandidates: NoteValue[],
    notesData: Notes
) => {
    const cellsSharingHousesWithCells = getHousesCellsSharedByCells(groupCells)
    return _filter(cellsSharingHousesWithCells, (cell: Cell) => {
        if (isCellExists(cell, groupCells)) return false
        return _some(groupCandidates, (groupCandidate: NoteValue) => NotesRecord.isNotePresentInCell(notesData, groupCandidate, cell))
    })
}

export const getCellsHighlightData = (
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

const getHostHousesText = (hostHouses: House[]) => {
    return hostHouses.map(commonHouse => `${getHouseNumText(commonHouse)} ${HOUSE_TYPE_VS_FULL_NAMES[commonHouse.type].FULL_NAME}`)
        .join(` ${HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND} `)
}

const getHintChunks = (
    groupCandidates: NoteValue[],
    groupCells: Cell[],
    hostHouses: House[],
    smartHintsTranslationsTexts: SmartHintsTranslationsTexts,
) => {

    const {
        texts,
    } = smartHintsTranslationsTexts.explanation[getHintId(groupCandidates)]

    const commonMsgPlaceholdersValues = {
        candidatesListTextAndConcatenated: getCandidatesListText(
            groupCandidates,
            smartHintsTranslationsTexts.common.conjugations.and,
        ),
        candidatesListTextOrConcatenated: getCandidatesListText(
            groupCandidates,
            smartHintsTranslationsTexts.common.conjugations.or,
        ),
        groupCellsText: getCellsAxesValuesListText(
            sortCells(groupCells),
            smartHintsTranslationsTexts.common.conjugations.and,
            getAxisValuesFromTranslations(smartHintsTranslationsTexts)
        ),
    }

    return texts.map(({ text, config }: { text: string, config: any }) => {
        const msgPlaceholdersValues = {
            ...commonMsgPlaceholdersValues,
            hostHouses: config.hostHouses ? getLanguageSpecificHouseListText(hostHouses, config.hostHouses, smartHintsTranslationsTexts) : undefined,
        }

        return dynamicInterpolation(text, msgPlaceholdersValues)
    })
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

const getRemovableNotesHostCellsMap = (groupCandidates: NoteValue[], removableNotesHostCells: Cell[], notes: Notes) => {
    const result: RemovableNotesInfo = {}

    removableNotesHostCells.forEach(cell => {
        const visibleNotes = NotesRecord.getCellVisibleNotesList(notes, cell)
        const removableGroupCandidatesInCell = _intersection(visibleNotes, groupCandidates)
        removableGroupCandidatesInCell.forEach((removableNote: NoteValue) => {
            if (_isNil(result[removableNote])) result[removableNote] = []
            result[removableNote].push(cell)
        })
    })

    return result
}
