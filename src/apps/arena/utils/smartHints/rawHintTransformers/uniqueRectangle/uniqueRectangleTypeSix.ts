import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'
import _filter from '@lodash/filter'
import _difference from '@lodash/difference'

import { BaseURRawHint, CellAndRemovableNotes, URTransformerArgs, UniqueRectangleTypeSixRawHint } from '../../types/uniqueRectangle'

import { TransformedRawHint, CellsFocusData, SmartHintsColorSystem, AddMainNumberHintAction } from '../../types'
import _map from '@lodash/map'
import { getCandidatesListText, getHintExplanationStepsFromHintChunks, joinStringsWithComma, setCellBGColor, setCellNotesColor } from '../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { areSameCells, getCellAxesValues, getCellHouseForHouseType } from '@domain/board/utils/housesAndCells'
import { HINTS_IDS, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'
import { HINT_EXPLANATION_TEXTS } from '../../stringLiterals'
import { UR_TYPES } from '../../uniqueRectangle/constants'
import { getCellsAxesValuesListText, getHouseOrdinalNum, getHouseOrdinalNumAndName } from '../helpers'
import { getURHostCellsWithExtraCandidates, getExtraNotesInURCells, getExtraNotesInURCell, getURHostCellsHavingURNotesOnly } from './helpers'
import _find from '@lodash/find'
import { areSameHouses, getCellsCommonHouses, getCellsCommonHousesInfo } from '../../../util'
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

const getHintExplanationText = (ur: UniqueRectangleTypeSixRawHint, notes: Notes) => {
    const cellsWithExtraCandidates = getURHostCellsWithExtraCandidates(ur, notes)
    const msgPlaceholdersValues = {
        urNotes: getCandidatesListText(ur.urNotes, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        cellsWithExtraCandidateList: getCellsAxesValuesListText(cellsWithExtraCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.OR),
        firstCellWithExtraCandidates: getCellAxesValues(cellsWithExtraCandidates[0]),
        extraCandidatesInFirstCell: getCandidatesListText(getExtraNotesInURCell(ur, cellsWithExtraCandidates[0], notes), HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.OR),
        secondCellWithExtraCandidates: getCellAxesValues(cellsWithExtraCandidates[1]),
        extraCandidatesInSecondCell: getCandidatesListText(getExtraNotesInURCell(ur, cellsWithExtraCandidates[1], notes), HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.OR),
        removableCandidate: ur.xWing.candidate,
        xWingCandidate: ur.xWing.candidate,
        rowHostHouses: `${joinStringsWithComma(_map(ur.xWing.houses.rows, (house: House) => getHouseOrdinalNum(house)))} rows`,
        columnHostHouses: `${joinStringsWithComma(_map(ur.xWing.houses.columns, (house: House) => getHouseOrdinalNum(house)))} columns`,
        urHostCellInSameRowWithFirstCellWithExtraCandidates: getCellAxesValues(getURHostCellsSharingGivenHouseWithCell(
            ur, getCellHouseForHouseType(HOUSE_TYPE.ROW, cellsWithExtraCandidates[0]), cellsWithExtraCandidates[0]
        )[0]),
        urHostCellInSameColWithFirstCellWithExtraCandidates: getCellAxesValues(getURHostCellsSharingGivenHouseWithCell(
            ur, getCellHouseForHouseType(HOUSE_TYPE.COL, cellsWithExtraCandidates[0]), cellsWithExtraCandidates[0]
        )[0]),
        firstCellWithExtraCandidatesRowHouse: getHouseOrdinalNumAndName(getCellHouseForHouseType(HOUSE_TYPE.ROW, cellsWithExtraCandidates[0])),
        firstCellWithExtraCandidatesColumnHouse: getHouseOrdinalNumAndName(getCellHouseForHouseType(HOUSE_TYPE.COL, cellsWithExtraCandidates[0])),
        urHostCellInSameRowWithSecondCellWithExtraCandidates: getCellAxesValues(getURHostCellsSharingGivenHouseWithCell(
            ur, getCellHouseForHouseType(HOUSE_TYPE.ROW, cellsWithExtraCandidates[1]), cellsWithExtraCandidates[1]
        )[0]),
        urHostCellInSameColWithSecondCellWithExtraCandidates: getCellAxesValues(getURHostCellsSharingGivenHouseWithCell(
            ur, getCellHouseForHouseType(HOUSE_TYPE.COL, cellsWithExtraCandidates[1]), cellsWithExtraCandidates[1]
        )[0]),
        secondCellWithExtraCandidatesRowHouse: getHouseOrdinalNumAndName(getCellHouseForHouseType(HOUSE_TYPE.ROW, cellsWithExtraCandidates[1])),
        secondCellWithExtraCandidatesColumnHouse: getHouseOrdinalNumAndName(getCellHouseForHouseType(HOUSE_TYPE.COL, cellsWithExtraCandidates[1])),
        cellsHavingOnlyURNotes: getCellsAxesValuesListText(getURHostCellsHavingURNotesOnly(ur, notes)),
        firstURNote: ur.urNotes[0],
        secondURNote: ur.urNotes[1],
        firstHostCell: getCellAxesValues(ur.hostCells[0]),
        secondHostCell: getCellAxesValues(ur.hostCells[1]),
        thirdHostCell: getCellAxesValues(ur.hostCells[2]),
        fourthHostCell: getCellAxesValues(ur.hostCells[3])
    }

    const msgTemplates = HINT_EXPLANATION_TEXTS[HINTS_IDS.UNIQUE_RECTANGLE][UR_TYPES.TYPE_SIX]
    const hintChunks = msgTemplates.map((msgTemplate: string) => dynamicInterpolation(msgTemplate, msgPlaceholdersValues))
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
    smartHintsColorSystem
}: URTransformerArgs): TransformedRawHint => {
    return {
        title: 'Unique Rectangle-6',
        hasTryOut: false,
        steps: getHintExplanationText(ur as UniqueRectangleTypeSixRawHint, notesData),
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
