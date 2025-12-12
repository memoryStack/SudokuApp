import { dynamicInterpolation } from '@lodash/dynamicInterpolation'

import { NotesRecord } from '@domain/board/records/notesRecord'

import {
    getHouseCells, isRowHouse, getCellHouseForHouseType
} from '@domain/board/utils/housesAndCells'

import { HOUSE_TYPE } from '@domain/board/board.constants'

import {
    HINTS_IDS,
    HINT_TEXT_ELEMENTS_JOIN_CONJUGATION,
} from '../../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../../stringLiterals'
import { getCellAxesValues } from '../../../../util'

import {
    getCellsFromCellsToFocusedData,
    setCellDataInHintResult,
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
    transformCellBGColor,
    getAxisValuesFromTranslations,
    getLanguageSpecificHouseNumText,
    getLanguageSpecificHouseTypeText,
    HouseNumTextTranslationConfig,
} from '../../../util'
import { getCellsAxesValuesListText } from '../../helpers'

import {
    categorizeLegs,
    categorizeFinnedLegCells,
    getFinnedXWingRemovableNotesHostCells,
    getPerfectCellsInFinnedBlock,
    getXWingCandidate,
    getXWingHosuesInOrder,
    getXWingCells,
    getCrossHouseType,
} from '../../../xWing/utils'
import { XWING_TYPES } from '../../../xWing/constants'

import { getApplyHintData } from './helpers'
import smartHintColorSystemReader from '../../../colorSystem.reader'
import {
    CellHighlightData, CellsFocusData, SmartHintsColorSystem, SmartHintsTranslationsTexts, TransformedRawHint,
} from '../../../types'
import { XWingRawHint } from '../../../xWing/types'

type FinnedXWingTranslation = {
    texts: { text: string, config: Record<string, any> }[]
    finnCellsPrefix: { singular: string, plural: string }
}

type CommonTranslations = {
    houseTypes: {
        cell: { singular: string, plural: string }
        [key: string]: any
    }
    shareVerb: { singular: string, plural: string }
    corners: { singular: string, plural: string }
    conjugations: { and: string, or: string }
    [key: string]: any
}

const getPlaceholdersValues = (
    xWing: XWingRawHint,
    removableNotesHostCells: Cell[],
    config: Record<string, any>,
    smartHintsTranslationsTexts: SmartHintsTranslationsTexts
) => {
    const { houseType, legs } = xWing
    const { perfectLeg, otherLeg: finnedLeg } = categorizeLegs(legs[0], legs[1])
    const { finns: finnCells } = categorizeFinnedLegCells(perfectLeg.cells, finnedLeg.cells)
    const finnedBlockPerfectCells = getPerfectCellsInFinnedBlock(legs)
    const xWingHouses = getXWingHosuesInOrder(xWing)
    const crossHouseType = getCrossHouseType(houseType)

    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)
    const finnedXWingTranslation = smartHintsTranslationsTexts.explanation[HINTS_IDS.FINNED_X_WING] as unknown as FinnedXWingTranslation
    const finnCellsPrefixConfig = finnedXWingTranslation.finnCellsPrefix
    const common = smartHintsTranslationsTexts.common as unknown as CommonTranslations

    const finnedLegAxesTextConfig = config?.finnedLegAxesText?.houseNum as HouseNumTextTranslationConfig
    const finnedLegHouseTextConfig = config?.finnedLegHouseText
    return {
        candidate: getXWingCandidate(xWing),
        finnedLegAxesText: finnedLegAxesTextConfig
            ? getLanguageSpecificHouseNumText(
                getCellHouseForHouseType(houseType, finnedLeg.cells[0]),
                finnedLegAxesTextConfig,
                smartHintsTranslationsTexts
            )
            : undefined,
        finnedLegHouseText: finnedLegHouseTextConfig
            ? getLanguageSpecificHouseTypeText(houseType, finnedLegHouseTextConfig, smartHintsTranslationsTexts)
            : undefined,
        finnCellsAxesListText: getCellsAxesValuesListText(finnCells, '', axisValues),
        finnCellEnglishText: finnCells.length === 1
            ? common.houseTypes.cell.singular
            : common.houseTypes.cell.plural,
        shareVerbGrammaticalText: finnCells.length === 1
            ? common.shareVerb.singular
            : common.shareVerb.plural,
        finnedBlockPerfectCellsAxesText: getCellsAxesValuesListText(
            finnedBlockPerfectCells,
            common.conjugations.and,
            axisValues
        ),
        cornersText: finnedBlockPerfectCells.length === 1
            ? common.corners.singular
            : common.corners.plural,
        crossHouseFullNamePlural: config?.crossHouseFullNamePlural
            ? getLanguageSpecificHouseTypeText(crossHouseType, config.crossHouseFullNamePlural, smartHintsTranslationsTexts)
            : undefined,
        hostHousesAxesListText: finnedLegAxesTextConfig ? `${getLanguageSpecificHouseNumText(
            xWingHouses[0],
            finnedLegAxesTextConfig,
            smartHintsTranslationsTexts
        )} ${common.conjugations.and} ${getLanguageSpecificHouseNumText(
            xWingHouses[1],
            finnedLegAxesTextConfig,
            smartHintsTranslationsTexts
        )}` : undefined,
        hostHousePluralName: config?.hostHousePluralName
            ? getLanguageSpecificHouseTypeText(houseType, config.hostHousePluralName, smartHintsTranslationsTexts)
            : undefined,
        removableNotesHostCells: getCellsAxesValuesListText(
            removableNotesHostCells,
            common.conjugations.and,
            axisValues
        ),
        removableNotesHostCellsText: removableNotesHostCells.length === 1
            ? common.houseTypes.cell.singular
            : common.houseTypes.cell.plural,
        finnCellsPrefix: finnCells.length === 1
            ? finnCellsPrefixConfig.singular
            : finnCellsPrefixConfig.plural,
    }
}

const getFinnedXWingHintChunks = (
    xWing: XWingRawHint,
    removableNotesHostCells: Cell[],
    smartHintsTranslationsTexts: SmartHintsTranslationsTexts
): string[] => {
    const finnedXWingTranslation = smartHintsTranslationsTexts.explanation[HINTS_IDS.FINNED_X_WING] as unknown as FinnedXWingTranslation
    const { texts } = finnedXWingTranslation

    return texts.map(({ text, config }: { text: string, config: Record<string, any> }) => {
        const msgPlaceholdersValues = getPlaceholdersValues(xWing, removableNotesHostCells, config, smartHintsTranslationsTexts)
        return dynamicInterpolation(text, msgPlaceholdersValues)
    })
}

// this implementation is different from utils implementation
const getSashimiCell = (xWing: XWingRawHint, notes: Notes) => {
    const { legs } = xWing
    const { otherLeg: finnedLeg } = categorizeLegs(legs[0], legs[1])

    const candidate = getXWingCandidate(xWing)
    return finnedLeg.cells.find(cell => !NotesRecord.isNotePresentInCell(notes, candidate, cell))
}

const getSashimiFinnedHintChunks = (
    xWing: XWingRawHint,
    removableNotesHostCells: Cell[],
    notes: Notes,
    smartHintsTranslationsTexts: SmartHintsTranslationsTexts
): string[] => {
    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)
    const finnedXWingTranslation = smartHintsTranslationsTexts.explanation[HINTS_IDS.SASHIMI_FINNED_X_WING] as unknown as FinnedXWingTranslation
    const { texts } = finnedXWingTranslation

    return texts.map(({ text, config }: { text: string, config: Record<string, any> }) => {
        const msgPlaceholdersValues = {
            ...getPlaceholdersValues(xWing, removableNotesHostCells, config, smartHintsTranslationsTexts),
            sashimiCellAxesText: getCellAxesValues(getSashimiCell(xWing, notes) as Cell, axisValues),
            sashimiCell: getCellAxesValues(getSashimiCell(xWing, notes) as Cell, axisValues)
        }
        return dynamicInterpolation(text, msgPlaceholdersValues)
    })
}

// doing 2 things
const defaultHighlightHouseCells = (
    { houseType, cells }: { houseType: HouseType, cells: Cell[][] },
    cellsToFocusData: CellsFocusData,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    const firstHouseNum = isRowHouse(houseType) ? cells[0][0].row : cells[0][0].col
    const secondHouseNum = isRowHouse(houseType) ? cells[1][0].row : cells[1][0].col

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
    const firstCrossHouseNum = isRowHouse(houseType) ? cells[0][0].col : cells[0][0].row
    const secondCrossHouseNum = isRowHouse(houseType) ? cells[0][1].col : cells[0][1].row
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
    smartHintsTranslationsTexts: SmartHintsTranslationsTexts,
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
        ? getFinnedXWingHintChunks(xWing, removableNotesHostCells, smartHintsTranslationsTexts)
        : getSashimiFinnedHintChunks(xWing, removableNotesHostCells, notesData, smartHintsTranslationsTexts)

    return {
        type: finnedXWingType === XWING_TYPES.FINNED ? HINTS_IDS.FINNED_X_WING : HINTS_IDS.SASHIMI_FINNED_X_WING,
        cellsToFocusData,
        title:
            finnedXWingType === XWING_TYPES.FINNED
                ? smartHintsTranslationsTexts.title[HINTS_IDS.FINNED_X_WING]
                : smartHintsTranslationsTexts.title[HINTS_IDS.SASHIMI_FINNED_X_WING],
        steps: getHintExplanationStepsFromHintChunks(hintChunks),
        applyHint: getApplyHintData(candidate, removableNotesHostCells),
        ...tryOutProps,
    }
}
