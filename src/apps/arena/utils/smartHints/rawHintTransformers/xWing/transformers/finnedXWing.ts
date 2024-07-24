import { dynamicInterpolation } from '@lodash/dynamicInterpolation'

import { Houses } from '../../../../classes/houses'
import { NotesRecord } from '../../../../../RecordUtilities/boardNotes'
import { getHouseCells } from '@domain/board/utils/housesAndCells'

import {
    HINTS_IDS,
    HINT_TEXT_ELEMENTS_JOIN_CONJUGATION,
    HOUSE_TYPE,
    HOUSE_TYPE_VS_FULL_NAMES,
} from '../../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../../stringLiterals'
import { getCellAxesValues, getCellHouseForHouseType } from '../../../../util'

import {
    getCellsFromCellsToFocusedData,
    setCellDataInHintResult,
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
    transformCellBGColor,
} from '../../../util'
import { getCellsAxesValuesListText, getHouseNumText } from '../../helpers'

import {
    categorizeLegs,
    categorizeFinnedLegCells,
    getFinnedXWingRemovableNotesHostCells,
    getPerfectCellsInFinnedBlock,
    getXWingCandidate,
    getXWingHosuesInOrder,
    getXWingCells,
} from '../../../xWing/utils'
import { XWING_TYPES } from '../../../xWing/constants'

import { getApplyHintData, getXWingCrossHouseFullNamePlural } from './helpers'
import smartHintColorSystemReader from '../../../colorSystem.reader'
import {
    CellHighlightData, CellsFocusData, SmartHintsColorSystem, TransformedRawHint,
} from '../../../types'
import { XWingRawHint } from '../../../xWing/types'

const getCrossHouseType = (houseType: HouseType) => (Houses.isRowHouse(houseType) ? HOUSE_TYPE.COL : HOUSE_TYPE.ROW)

const getPlaceholdersValues = (xWing: XWingRawHint, removableNotesHostCells: Cell[]) => {
    const { houseType, legs } = xWing
    const { perfectLeg, otherLeg: finnedLeg } = categorizeLegs(legs[0], legs[1])
    const { finns: finnCells } = categorizeFinnedLegCells(perfectLeg.cells, finnedLeg.cells)
    const finnedBlockPerfectCells = getPerfectCellsInFinnedBlock(legs)
    const xWingHouses = getXWingHosuesInOrder(xWing)

    return {
        candidate: getXWingCandidate(xWing),
        finnedLegAxesText: getHouseNumText(getCellHouseForHouseType(houseType, finnedLeg.cells[0])),
        finnedLegHouseText: HOUSE_TYPE_VS_FULL_NAMES[houseType].FULL_NAME,
        finnCellsAxesListText: getCellsAxesValuesListText(finnCells),
        finnCellEnglishText: finnCells.length === 1 ? 'cell' : 'cells',
        shareVerbGrammaticalText: finnCells.length === 1 ? 'shares' : 'share',
        finnedBlockPerfectCellsAxesText: getCellsAxesValuesListText(
            finnedBlockPerfectCells,
            HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND,
        ),
        cornersText: finnedBlockPerfectCells.length === 1 ? 'corner' : 'corners',
        crossHouseFullNamePlural: getXWingCrossHouseFullNamePlural(xWing),
        hostHousesAxesListText: `${getHouseNumText(xWingHouses[0])} and ${getHouseNumText(xWingHouses[1])}`,
        hostHousePluralName: HOUSE_TYPE_VS_FULL_NAMES[houseType].FULL_NAME_PLURAL,
        removableNotesHostCells: getCellsAxesValuesListText(removableNotesHostCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        removableNotesHostCellsText: removableNotesHostCells.length === 1 ? 'cell' : 'cells',
        finnCellsPrefix: finnCells.length === 1 ? 'the' : 'any of the',
    }
}

const getFinnedXWingHintChunks = (xWing: XWingRawHint, removableNotesHostCells: Cell[]): string[] => {
    const msgPlaceholdersValues = getPlaceholdersValues(xWing, removableNotesHostCells)

    return (HINT_EXPLANATION_TEXTS[HINTS_IDS.FINNED_X_WING] as string[])
        .map(template => dynamicInterpolation(template, msgPlaceholdersValues))
}

// this implementation is different from utils implementation
const getSashimiCell = (xWing: XWingRawHint, notes: Notes) => {
    const { legs } = xWing
    const { otherLeg: finnedLeg } = categorizeLegs(legs[0], legs[1])

    const candidate = getXWingCandidate(xWing)
    return finnedLeg.cells.find(cell => !NotesRecord.isNotePresentInCell(notes, candidate, cell))
}

const getSashimiFinnedHintChunks = (xWing: XWingRawHint, removableNotesHostCells: Cell[], notes: Notes): string[] => {
    const placeholdersValues = {
        ...getPlaceholdersValues(xWing, removableNotesHostCells),
        sashimiCellAxesText: getCellAxesValues(getSashimiCell(xWing, notes) as Cell),
        sashimiCell: getCellAxesValues(getSashimiCell(xWing, notes) as Cell),
    }

    return (HINT_EXPLANATION_TEXTS[HINTS_IDS.SASHIMI_FINNED_X_WING] as string[])
        .map(template => dynamicInterpolation(template, placeholdersValues))
}

// doing 2 things
const defaultHighlightHouseCells = (
    { houseType, cells }: { houseType: HouseType, cells: Cell[][] },
    cellsToFocusData: CellsFocusData,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    const firstHouseNum = Houses.isRowHouse(houseType) ? cells[0][0].row : cells[0][0].col
    const secondHouseNum = Houses.isRowHouse(houseType) ? cells[1][0].row : cells[1][0].col

    const xWingHousesNum = [firstHouseNum, secondHouseNum]
    xWingHousesNum.forEach(houseNum => {
        getHouseCells({ type: houseType, num: houseNum }).forEach(cell => {
            const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
            setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
        })
    })
}

const defaultHighlightCrossHouseCells = (
    { houseType, cells }: { houseType: HouseType, cells: Cell[][] },
    cellsToFocusData: CellsFocusData,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    const firstCrossHouseNum = Houses.isRowHouse(houseType) ? cells[0][0].col : cells[0][0].row
    const secondCrossHouseNum = Houses.isRowHouse(houseType) ? cells[0][1].col : cells[0][1].row
    const crossHousesNum = [firstCrossHouseNum, secondCrossHouseNum]
    crossHousesNum.forEach(houseNum => {
        const crossHouseType = getCrossHouseType(houseType)
        getHouseCells({ type: crossHouseType, num: houseNum }).forEach(cell => {
            const cellHighlightData = {
                bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)),
            }
            setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
        })
    })
}

// TODO: fix the order of cells here. sometimes topLeft cell takes different color
const highlightXWingCells = (
    cells: Cell[],
    candidate: NoteValue,
    cellsToFocusData: CellsFocusData,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    cells.forEach(({ row, col }, index) => {
        const isTopLeftCell = index === 0
        const isBottomRightCell = index === 3

        const cellHighlightData: CellHighlightData = {
            bgColor: transformCellBGColor(
                isTopLeftCell || isBottomRightCell ? smartHintColorSystemReader.xWingTopLeftBottomRightCellBGColor(smartHintsColorSystem)
                    : smartHintColorSystemReader.xWingTopRightBottomLeftCellBGColor(smartHintsColorSystem),
            ),
            notesToHighlightData: {
                [candidate]: { fontColor: smartHintColorSystemReader.safeNoteColor(smartHintsColorSystem) },
            },
        }
        setCellDataInHintResult({ row, col }, cellHighlightData, cellsToFocusData)
    })
}

const highlightFinnCells = (
    finnCells: Cell[],
    candidate: NoteValue,
    cellsToFocusData: CellsFocusData,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    finnCells.forEach(({ row, col }) => {
        const cellHighlightData: CellHighlightData = {
            bgColor: transformCellBGColor(smartHintColorSystemReader.xWingFinnCellBGColor(smartHintsColorSystem)),
            notesToHighlightData: {
                [candidate]: { fontColor: smartHintColorSystemReader.safeNoteColor(smartHintsColorSystem) },
            },
        }
        setCellDataInHintResult({ row, col }, cellHighlightData, cellsToFocusData)
    })
}

const highlightRemovableNotesHostCells = (
    hostCells: Cell[],
    candidate: NoteValue,
    notesData: Notes,
    cellsToFocusData: CellsFocusData,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    hostCells
        .filter(cell => NotesRecord.isNotePresentInCell(notesData, candidate, cell))
        .forEach(cell => {
            const cellHighlightData: CellHighlightData = {
                bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)),
                notesToHighlightData: {
                    [candidate]: { fontColor: smartHintColorSystemReader.toBeRemovedNoteColor(smartHintsColorSystem) },
                },
            }
            setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
        })
}

export const getFinnedXWingUIData = (
    xWing: XWingRawHint,
    notesData: Notes,
    smartHintsColorSystem: SmartHintsColorSystem,
): TransformedRawHint => {
    const { type: finnedXWingType, legs, houseType } = xWing
    const { candidate } = legs[0]

    const { perfectLeg, otherLeg: finnedLeg } = categorizeLegs(legs[0], legs[1])

    const { perfect: finnedLegPerfectCells, finns: finnCells } = categorizeFinnedLegCells(
        perfectLeg.cells,
        finnedLeg.cells,
    )

    const cellsToFocusData: CellsFocusData = {}

    const removableNotesHostCells = getFinnedXWingRemovableNotesHostCells(xWing, notesData)

    defaultHighlightHouseCells({ houseType, cells: [perfectLeg.cells, finnedLegPerfectCells] }, cellsToFocusData, smartHintsColorSystem)
    defaultHighlightCrossHouseCells({ houseType, cells: [perfectLeg.cells, finnedLegPerfectCells] }, cellsToFocusData, smartHintsColorSystem)
    highlightXWingCells([...perfectLeg.cells, ...finnedLegPerfectCells], candidate, cellsToFocusData, smartHintsColorSystem)
    highlightFinnCells(finnCells, candidate, cellsToFocusData, smartHintsColorSystem)
    highlightRemovableNotesHostCells(removableNotesHostCells, candidate, notesData, cellsToFocusData, smartHintsColorSystem)

    const focusedCells = getCellsFromCellsToFocusedData(cellsToFocusData)
    const tryOutProps = {
        hasTryOut: true,
        focusedCells,
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility([candidate]) as InputPanelVisibleNumbers,
        clickableCells: [...removableNotesHostCells, ...getXWingCells(xWing.legs)],
        unclickableCellClickInTryOutMsg: 'you can select cells which have candidates highlighted in green or red color. because we are not commenting about other cells.',
        tryOutAnalyserData: {
            xWing,
            removableNotesHostCells,
        },
    }

    const hintChunks = finnedXWingType === XWING_TYPES.FINNED
        ? getFinnedXWingHintChunks(xWing, removableNotesHostCells)
        : getSashimiFinnedHintChunks(xWing, removableNotesHostCells, notesData)

    return {
        type: finnedXWingType === XWING_TYPES.FINNED ? HINTS_IDS.FINNED_X_WING : HINTS_IDS.SASHIMI_FINNED_X_WING,
        cellsToFocusData,
        title:
            finnedXWingType === XWING_TYPES.FINNED
                ? HINT_ID_VS_TITLES[HINTS_IDS.FINNED_X_WING]
                : HINT_ID_VS_TITLES[HINTS_IDS.SASHIMI_FINNED_X_WING],
        steps: getHintExplanationStepsFromHintChunks(hintChunks),
        applyHint: getApplyHintData(candidate, removableNotesHostCells),
        ...tryOutProps,
    }
}
