import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'
import _filter from '@lodash/filter'
import _difference from '@lodash/difference'

import { BaseURRawHint, CellAndRemovableNotes, URTransformerArgs, UniqueRectangleTypeSixRawHint } from '../../types/uniqueRectangle'

import { TransformedRawHint, CellsFocusData, SmartHintsColorSystem, AddMainNumberHintAction, SmartHintsTranslationsTexts } from '../../types'
import _map from '@lodash/map'
import { getAxisValuesFromTranslations, getCandidatesListText, getHintExplanationStepsFromHintChunks, getHouseWithNumAndNameText, getLanguageSpecificHouseNumText, getLanguageSpecificHouseTypeText, joinStringsWithComma, setCellBGColor, setCellNotesColor } from '../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { areSameCells, getCellHouseForHouseType } from '@domain/board/utils/housesAndCells'
import { HINTS_IDS, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'
import { HINT_EXPLANATION_TEXTS } from '../../stringLiterals'
import { UR_TYPES } from '../../uniqueRectangle/constants'
import { getCellsAxesValuesListText, getHouseOrdinalNum, getHouseOrdinalNumAndName } from '../helpers'
import { getURHostCellsWithExtraCandidates, getExtraNotesInURCells, getExtraNotesInURCell, getURHostCellsHavingURNotesOnly } from './helpers'
import _find from '@lodash/find'
import { areSameHouses, getCellsCommonHouses, getCellsCommonHousesInfo, getCellAxesValues } from '../../../util'
import { HOUSE_TYPE } from '@domain/board/board.constants'
import { BOARD_MOVES_TYPES } from '@application/constants'

const getCellsToFocusData = (
    ur: BaseURRawHint,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    const cellsToFocusData: CellsFocusData = {}

    _forEach(getCellsToFocus(ur), (cell: Cell) => {
        setCellBGColor(cell, smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem), cellsToFocusData)
    })
    _forEach(ur.hostCells, (cell: Cell) => {
        setCellNotesColor(cell, ur.urNotes, smartHintColorSystemReader.safeNoteColor(smartHintsColorSystem), cellsToFocusData)
    })
    _forEach(ur.cellAndRemovableNotes, ({ cell, notes }: CellAndRemovableNotes) => {
        setCellNotesColor(cell, notes, smartHintColorSystemReader.toBeRemovedNoteColor(smartHintsColorSystem), cellsToFocusData)
    })

    return cellsToFocusData
}

const getURHostCellsSharingGivenHouseWithCell = (ur: BaseURRawHint, house: House, cell: Cell) => {
    return _filter(ur.hostCells, (hostCell: Cell) => {
        if (areSameCells(hostCell, cell)) return false
        return getCellsCommonHousesInfo([hostCell, cell]).some((commonHouse: House) => {
            return areSameHouses(commonHouse, house)
        })
    })
}

const getHintExplanationText = (
    ur: UniqueRectangleTypeSixRawHint,
    notes: Notes,
    smartHintsTranslationsTexts: SmartHintsTranslationsTexts
) => {
    const { texts, config } = smartHintsTranslationsTexts.explanation[HINTS_IDS.UNIQUE_RECTANGLE][UR_TYPES.TYPE_SIX]
    const axesValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)
    const cellsWithExtraCandidates = getURHostCellsWithExtraCandidates(ur, notes)
    const { conjugations } = smartHintsTranslationsTexts.common
    const msgPlaceholdersValues = {
        urNotes: getCandidatesListText(ur.urNotes, conjugations.and),
        cellsWithExtraCandidateList: getCellsAxesValuesListText(cellsWithExtraCandidates, conjugations.or, axesValues),
        firstCellWithExtraCandidates: getCellAxesValues(cellsWithExtraCandidates[0], axesValues),
        extraCandidatesInFirstCell: getCandidatesListText(getExtraNotesInURCell(ur, cellsWithExtraCandidates[0], notes), conjugations.or),
        secondCellWithExtraCandidates: getCellAxesValues(cellsWithExtraCandidates[1], axesValues),
        extraCandidatesInSecondCell: getCandidatesListText(getExtraNotesInURCell(ur, cellsWithExtraCandidates[1], notes), conjugations.or),
        removableCandidate: ur.xWing.candidate,
        xWingCandidate: ur.xWing.candidate,
        rowHostHouses: `${joinStringsWithComma(_map(ur.xWing.houses.rows, (house: House) => getLanguageSpecificHouseNumText(house, config.hostHouses.houseNum, smartHintsTranslationsTexts)))} ${getLanguageSpecificHouseTypeText(HOUSE_TYPE.ROW, config.hostHouses.houseName, smartHintsTranslationsTexts)}`,
        columnHostHouses: `${joinStringsWithComma(_map(ur.xWing.houses.columns, (house: House) => getLanguageSpecificHouseNumText(house, config.hostHouses.houseNum, smartHintsTranslationsTexts)))} ${getLanguageSpecificHouseTypeText(HOUSE_TYPE.COL, config.hostHouses.houseName, smartHintsTranslationsTexts)}`,
        urHostCellInSameRowWithFirstCellWithExtraCandidates: getCellAxesValues(getURHostCellsSharingGivenHouseWithCell(
            ur, getCellHouseForHouseType(HOUSE_TYPE.ROW, cellsWithExtraCandidates[0]), cellsWithExtraCandidates[0]
        )[0], axesValues),
        urHostCellInSameColWithFirstCellWithExtraCandidates: getCellAxesValues(getURHostCellsSharingGivenHouseWithCell(
            ur, getCellHouseForHouseType(HOUSE_TYPE.COL, cellsWithExtraCandidates[0]), cellsWithExtraCandidates[0]
        )[0], axesValues),
        firstCellWithExtraCandidatesRowHouse: getHouseWithNumAndNameText(
            getCellHouseForHouseType(HOUSE_TYPE.ROW, cellsWithExtraCandidates[0]),
            config.houseNumAndName,
            smartHintsTranslationsTexts
        ),
        firstCellWithExtraCandidatesColumnHouse: getHouseWithNumAndNameText(
            getCellHouseForHouseType(HOUSE_TYPE.COL, cellsWithExtraCandidates[0]),
            config.houseNumAndName,
            smartHintsTranslationsTexts
        ),
        urHostCellInSameRowWithSecondCellWithExtraCandidates: getCellAxesValues(getURHostCellsSharingGivenHouseWithCell(
            ur, getCellHouseForHouseType(HOUSE_TYPE.ROW, cellsWithExtraCandidates[1]), cellsWithExtraCandidates[1]
        )[0], axesValues),
        urHostCellInSameColWithSecondCellWithExtraCandidates: getCellAxesValues(getURHostCellsSharingGivenHouseWithCell(
            ur, getCellHouseForHouseType(HOUSE_TYPE.COL, cellsWithExtraCandidates[1]), cellsWithExtraCandidates[1]
        )[0], axesValues),
        secondCellWithExtraCandidatesRowHouse: getHouseWithNumAndNameText(
            getCellHouseForHouseType(HOUSE_TYPE.ROW, cellsWithExtraCandidates[1]),
            config.houseNumAndName,
            smartHintsTranslationsTexts
        ),
        secondCellWithExtraCandidatesColumnHouse: getHouseWithNumAndNameText(
            getCellHouseForHouseType(HOUSE_TYPE.COL, cellsWithExtraCandidates[1]),
            config.houseNumAndName,
            smartHintsTranslationsTexts
        ),
        cellsHavingOnlyURNotes: getCellsAxesValuesListText(getURHostCellsHavingURNotesOnly(ur, notes), undefined, axesValues),
        firstURNote: ur.urNotes[0],
        secondURNote: ur.urNotes[1],
        firstHostCell: getCellAxesValues(ur.hostCells[0], axesValues),
        secondHostCell: getCellAxesValues(ur.hostCells[1], axesValues),
        thirdHostCell: getCellAxesValues(ur.hostCells[2], axesValues),
        fourthHostCell: getCellAxesValues(ur.hostCells[3], axesValues)
    }

    const hintChunks = texts.map(({ text }: { text: string }) => dynamicInterpolation(text, msgPlaceholdersValues))
    return getHintExplanationStepsFromHintChunks(hintChunks, false)
}

const getCellsToFocus = (ur: BaseURRawHint) => {
    let result: Cell[] = []

    result = [...ur.hostCells]
    _forEach(ur.cellAndRemovableNotes, ({ cell }: CellAndRemovableNotes) => {
        result.push(cell)
    })

    return result
}

const getApplyHintData = (ur: UniqueRectangleTypeSixRawHint, notes: Notes): AddMainNumberHintAction[] => {
    const cellsHavingOnlyURNotes = getURHostCellsHavingURNotesOnly(ur, notes)
    return _map(cellsHavingOnlyURNotes, (cell: Cell) => {
        return {
            cell,
            action: { type: BOARD_MOVES_TYPES.ADD, mainNumber: ur.xWing.candidate },
        }
    })
}

export const transformURTypeSix = ({
    rawHint: ur,
    notesData,
    smartHintsColorSystem,
    smartHintsTranslationsTexts
}: URTransformerArgs): TransformedRawHint => {
    const generalTitleText = smartHintsTranslationsTexts.title[HINTS_IDS.UNIQUE_RECTANGLE]
    return {
        title: `${generalTitleText}-6`,
        hasTryOut: false,
        steps: getHintExplanationText(ur as UniqueRectangleTypeSixRawHint, notesData, smartHintsTranslationsTexts),
        cellsToFocusData: getCellsToFocusData(ur, smartHintsColorSystem),
        focusedCells: getCellsToFocus(ur),
        applyHint: getApplyHintData(ur as UniqueRectangleTypeSixRawHint, notesData),
        // tryOutAnalyserData: {
        //     wWing,
        // },
        // removableNotes: getRemovableNotesVsHostCells(ur), // how it's used ??
        // inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(wWing.nakedPairNotes) as InputPanelVisibleNumbers,
        // clickableCells: _cloneDeep(focusedCells),
        // unclickableCellClickInTryOutMsg: 'you can only select the cells which are highlighted here.',
    }
}
