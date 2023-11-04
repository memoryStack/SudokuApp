import _cloneDeep from '@lodash/cloneDeep'
import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'
import _isEmpty from '@lodash/isEmpty'
import _filter from '@lodash/filter'
import _unique from '@lodash/unique'
import _sortNumbers from '@lodash/sortNumbers'

import _sortBy from '@lodash/sortBy'
import _difference from '@lodash/difference'

import _isNil from '@lodash/isNil'
import _intersection from '@lodash/intersection'
import { NotesRecord } from '../../../../RecordUtilities/boardNotes'
import { MainNumbersRecord } from '../../../../RecordUtilities/boardMainNumbers'

import {
    HINTS_IDS, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, HOUSE_TYPE, HOUSE_TYPE_VS_FULL_NAMES,
} from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import {
    areSameBlockCells,
    areSameColCells,
    areSameRowCells,
    getCellAxesValues,
    isCellExists,
    sortCells,
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
import { HiddenGroupTransformerArgs } from './types'
import {
    CellHighlightData, CellsFocusData, NotesRemovalHintAction, NotesToHighlightData, RemovableNotesInfo, SmartHintsColorSystem, TransformedRawHint,
} from '../../types'

import { GroupCandidate, GroupCandidates, GroupHostCells } from '../../hiddenGroup/types'
import { getHouseNumText } from '../xWing/transformers/helpers'

export const getRemovableCandidates = (hostCells: GroupHostCells, groupCandidates: GroupCandidates, notesData: Notes) => {
    const result: NoteValue[] = []
    hostCells.forEach(cell => {
        const cellRemovableNotes = NotesRecord.getCellNotes(notesData, cell)
            .filter(({ show, noteValue }) => show && !groupCandidates.includes(noteValue))
            .map(({ noteValue }) => noteValue)
        result.push(...cellRemovableNotes)
    })

    return _sortNumbers(_unique(result))
}

const getCellNotesHighlightData = (
    isPrimaryHouse: boolean,
    cellNotes: Note[],
    groupCandidates: GroupCandidates,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    const result: NotesToHighlightData = {}
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

const highlightPrimaryHouseCells = (
    house: House,
    groupCandidates: GroupCandidates,
    groupHostCells: GroupHostCells,
    notesData: Notes,
    cellsToFocusData: CellsFocusData,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    const primaryHouseCells = getHouseCells(house)
    primaryHouseCells.forEach(cell => {
        const cellHighlightData: CellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
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

const isRowOrColHouse = (houseType: HouseType) => Houses.isRowHouse(houseType) || Houses.isColHouse(houseType)

const getSecondaryHostHouse = (primaryHouseType: HouseType, groupHostCells: Cell[]) => {
    // TODO: nested ifs. can it be made linear or refactor into better readability ??
    let result = {} as House

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

const shouldHighlightSecondaryHouseCells = (
    houseCells: Cell[],
    groupHostCells: GroupHostCells,
    groupCandidates: GroupCandidates,
    mainNumbers: MainNumbers,
    notesData: Notes,
) => houseCells.some(cell => {
    if (MainNumbersRecord.isCellFilled(mainNumbers, cell)) return false
    if (isCellExists(cell, groupHostCells)) return false
    return groupCandidates.some(groupCandidate => NotesRecord.isNotePresentInCell(notesData, groupCandidate, cell))
})

const highlightSecondaryHouseCells = (
    houseCells: Cell[],
    groupHostCells: GroupHostCells,
    groupCandidates: GroupCandidates,
    mainNumbers: MainNumbers,
    notesData: Notes,
    cellsToFocusData: CellsFocusData,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    houseCells.forEach(cell => {
        const isHostCell = isCellExists(cell, groupHostCells)
        if (!isHostCell) {
            const cellHighlightData: CellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
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

const getGroupCellsRemovableNotes = (
    groupCandidates: GroupCandidates,
    groupCells: GroupHostCells,
    notes: Notes,
) => {
    const allNotesInGroupCells: NoteValue[] = []
    _forEach(groupCells, (cell: Cell) => {
        allNotesInGroupCells.push(...NotesRecord.getCellVisibleNotesList(notes, cell))
    })
    return _sortBy(_difference(_unique(allNotesInGroupCells), groupCandidates)) as NoteValue[]
}

const getPrimaryHouseRemovableNotesHostCells = (
    groupCandidates: GroupCandidates,
    groupCells: GroupHostCells,
    notes: Notes,
) => {
    const result: Cell[] = []
    _forEach(groupCells, (cell: Cell) => {
        const cellNotes = NotesRecord.getCellVisibleNotesList(notes, cell)
        if (!_isEmpty(_difference(cellNotes, groupCandidates))) result.push(cell)
    })
    return sortCells(result)
}

const getSecondaryHouseRemovableNotes = (
    house: House,
    groupCandidates: GroupCandidates,
    groupCells: GroupHostCells,
    notes: Notes,
) => {
    const removableGroupCandidates: NoteValue[] = []
    getHouseCells(house).filter(cell => !isCellExists(cell, groupCells))
        .forEach(cell => {
            const groupCandidatesPresentInCell = _filter(groupCandidates, (groupCandidate: NoteValue) => NotesRecord.isNotePresentInCell(notes, groupCandidate, cell))
            removableGroupCandidates.push(...groupCandidatesPresentInCell)
        })
    return _sortBy(_unique(removableGroupCandidates)) as NoteValue[]
}

const getSecondaryHouseRemovableNotesHostCells = (
    house: House,
    groupCandidates: GroupCandidates,
    groupCells: GroupHostCells,
    notes: Notes,
) => {
    const result: Cell[] = []
    getHouseCells(house).filter(cell => !isCellExists(cell, groupCells))
        .forEach(cell => {
            const groupCandidatesPresentInCell = _filter(groupCandidates, (groupCandidate: NoteValue) => NotesRecord.isNotePresentInCell(notes, groupCandidate, cell))
            if (!_isEmpty(groupCandidatesPresentInCell)) result.push(cell)
        })

    return sortCells(result)
}

const getHintChunks = (
    house: House,
    groupCandidates: GroupCandidates,
    groupCells: GroupHostCells,
    secondaryHostHouse: House,
    secondaryHouseEligibleForHighlight: boolean,
    notes: Notes,
): string[] => {
    const hintId = groupCandidates.length === 2 ? HINTS_IDS.HIDDEN_DOUBLE : HINTS_IDS.HIDDEN_TRIPPLE
    const msgTemplates = secondaryHouseEligibleForHighlight ? HINT_EXPLANATION_TEXTS[hintId].REMOVABLE_NOTES_IN_SECONDARY_HOUSE
        : HINT_EXPLANATION_TEXTS[hintId].DEFAULT as string[]
    const groupCellsRemovableNotes = getGroupCellsRemovableNotes(groupCandidates, groupCells, notes)
    const primaryHouseRemovableNotesHostCells = getPrimaryHouseRemovableNotesHostCells(groupCandidates, groupCells, notes)
    const msgPlaceholdersValues = {
        houseType: HOUSE_TYPE_VS_FULL_NAMES[house.type].FULL_NAME,
        hostHouseNumText: getHouseNumText(house),
        candidatesListText: getCandidatesListText(_sortBy(groupCandidates), HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        groupCellsText: getCellsAxesValuesListText(sortCells(groupCells)),
        primaryHouseRemovableNotes: getCandidatesListText(groupCellsRemovableNotes),
        primaryHouseRemovableNotesHostCells: getCellsAxesValuesListText(primaryHouseRemovableNotesHostCells),
        ...secondaryHouseEligibleForHighlight && {
            secondaryHostHouse: `${getHouseNumText(secondaryHostHouse)} ${HOUSE_TYPE_VS_FULL_NAMES[secondaryHostHouse.type].FULL_NAME}`,
            secondaryHouseRemovableNotes: getCandidatesListText(getSecondaryHouseRemovableNotes(secondaryHostHouse, groupCandidates, groupCells, notes)),
            secondaryHouseRemovableNotesHostCells: getCellsAxesValuesListText(getSecondaryHouseRemovableNotesHostCells(secondaryHostHouse, groupCandidates, groupCells, notes)),
        },
    }
    return msgTemplates.map(msgTemplate => dynamicInterpolation(msgTemplate, msgPlaceholdersValues))
}

const getTryOutInputPanelAllowedCandidates = (groupCandidates: GroupCandidates, hostCells: GroupHostCells, notes: Notes): NoteValue[] => {
    const removableCandidates = getRemovableCandidates(hostCells, groupCandidates, notes)
    return _sortNumbers([...groupCandidates, ...removableCandidates])
}

const getRemovableGroupCandidatesHostCellsRestrictedNumberInputs = (
    removableGroupCandidatesHostCells: Cell[],
    groupCandidates: GroupCandidates,
    notes: Notes,
) => removableGroupCandidatesHostCells.reduce((prevValue, cell) => {
    const result = { ...prevValue }
    const restrictedInputsForCell = NotesRecord.getCellNotes(notes, cell)
        .filter(({ show, noteValue }) => show && !groupCandidates.includes(noteValue))
        .map(({ noteValue }) => noteValue)
    if (restrictedInputsForCell.length) {
        result[getCellAxesValues(cell)] = restrictedInputsForCell
    }
    return result
}, {} as {[key: string]: NoteValue[]})

const getApplyHintData = (
    groupCandidates: GroupCandidates,
    groupHostCells: GroupHostCells,
    removableGroupCandidatesHostCells: Cell[],
    notesData: Notes,
) => {
    const result: NotesRemovalHintAction[] = []

    _forEach(groupHostCells, (cell: Cell) => {
        const notesToRemove = NotesRecord.getCellVisibleNotesList(notesData, cell)
            .filter(note => !groupCandidates.includes(note))
        result.push({
            cell,
            action: { type: BOARD_MOVES_TYPES.REMOVE, notes: notesToRemove },
        })
    })

    _forEach(removableGroupCandidatesHostCells, (cell: Cell) => {
        const visibleGroupCandidatesInCell = _filter(groupCandidates, (groupCandidate: GroupCandidate) => NotesRecord.isNotePresentInCell(notesData, groupCandidate, cell))

        result.push({
            cell,
            action: { type: BOARD_MOVES_TYPES.REMOVE, notes: visibleGroupCandidatesInCell },
        })
    })

    return result
}

const getRemovableNotesHostCellsMap = (groupCandidates: NoteValue[], groupCells: Cell[], removableGroupCandidatesHostCells: Cell[], notes: Notes) => {
    const result: RemovableNotesInfo = {}

    groupCells.forEach(groupCell => {
        const visibleNotes = NotesRecord.getCellVisibleNotesList(notes, groupCell)
        const removableNotes = _difference(visibleNotes, groupCandidates)
        removableNotes.forEach((removableNote: NoteValue) => {
            if (_isNil(result[removableNote])) result[removableNote] = []
            result[removableNote].push(groupCell)
        })
    })

    removableGroupCandidatesHostCells.forEach(cell => {
        const visibleNotes = NotesRecord.getCellVisibleNotesList(notes, cell)
        const removableGroupCandidatesInCell = _intersection(visibleNotes, groupCandidates)
        removableGroupCandidatesInCell.forEach((removableNote: NoteValue) => {
            if (_isNil(result[removableNote])) result[removableNote] = []
            result[removableNote].push(cell)
        })
    })

    return result
}

export const transformHiddenGroupRawHint = ({
    rawHint: group,
    mainNumbers,
    notesData,
    smartHintsColorSystem,
}: HiddenGroupTransformerArgs): TransformedRawHint => {
    const { house, groupCandidates, groupCells: hostCells } = group

    const cellsToFocusData = {}

    highlightPrimaryHouseCells(house, groupCandidates, hostCells, notesData, cellsToFocusData, smartHintsColorSystem)

    let focusedCells = getHouseCells(house)
    let removableGroupCandidatesHostCells: Cell[] = []
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

    // pass secondary house as well here
    const hintChunks = getHintChunks(house, groupCandidates, hostCells, secondaryHostHouse, secondaryHouseEligibleForHighlight as boolean, notesData)

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
        removableNotes: getRemovableNotesHostCellsMap(groupCandidates, hostCells, removableGroupCandidatesHostCells, notesData),
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(tryOutInputPanelAllowedCandidates) as InputPanelVisibleNumbers,
        clickableCells: _cloneDeep([...hostCells, ...removableGroupCandidatesHostCells]),
        unclickableCellClickInTryOutMsg: 'you can select cells which have candidates highlighted in green or red color. because we are not commenting about other cells.',
        cellsRestrictedNumberInputs: getRemovableGroupCandidatesHostCellsRestrictedNumberInputs(
            removableGroupCandidatesHostCells,
            groupCandidates,
            notesData,
        ),
        restrictedNumberInputMsg:
            'input the numbers which are highlighted in red color in this cell. other numbers don\'t help in learning this hint.',
    }
}
