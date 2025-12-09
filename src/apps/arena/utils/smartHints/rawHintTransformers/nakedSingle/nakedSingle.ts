import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'
import { toOrdinal } from '@lodash/toOrdinal'

import { getCellRowHouseInfo } from '@domain/board/utils/housesAndCells'

import { HOUSE_TYPE } from '@domain/board/board.constants'

import { getLinkHTMLText } from 'src/apps/hintsVocabulary/vocabExplainations/utils'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import {
    NAKED_SINGLE_TYPES,
    HINTS_IDS,
    HOUSE_TYPE_VS_FULL_NAMES,
} from '../../constants'
import { HINT_ID_VS_TITLES, HintExplainationTexts } from '../../stringLiterals'
import { setCellDataInHintResult, transformCellBGColor } from '../../util'
import {
    areSameCells,
    getCellAxesValues,
    getCellHousesInfo,
    getHouseAxesValue,
} from '../../../util'
import { getHouseCells, getCellColHouseInfo, getCellBlockHouseInfo } from '@domain/board/utils/housesAndCells'
import { BOARD_MOVES_TYPES } from '../../../../constants'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { NakedSingleRawHint } from '../../nakedSingle/types'
import {
    AddMainNumberHintAction, CellsFocusData, SmartHintsColorSystem, TransformedRawHint,
} from '../../types'

import { NakedSingleTransformerArgs } from './types'
import { HINTS_VOCAB_IDS } from '../constants'

const getSingleHouseNakedSingleDescription = (houseType: HouseType, solutionValue: SolutionValue, cell: Cell, smartHintsExplanationTexts: HintExplainationTexts): string => {
    const msgPlaceholdersValues = {
        houseType: HOUSE_TYPE_VS_FULL_NAMES[houseType].FULL_NAME,
        solutionValue,
        cellAxesText: getCellAxesValues(cell),
    }
    const explainations = smartHintsExplanationTexts[HINTS_IDS.NAKED_SINGLE]
    return dynamicInterpolation(explainations.SINGLE_HOUSE, msgPlaceholdersValues)
}

const getCellHousesText = (cell: Cell) => {
    // msg will break if order of houses is changed in returned response of this function
    const cellHouses = getCellHousesInfo(cell)
    const columnNum = toOrdinal(cellHouses[1].num + 1)
    const blockNum = toOrdinal(cellHouses[2].num + 1)
    return `${getHouseAxesValue(cellHouses[0])} ${getLinkHTMLText(HINTS_VOCAB_IDS.ROW, 'row')}, ${columnNum} ${getLinkHTMLText(HINTS_VOCAB_IDS.COLUMN, 'column')} and ${blockNum} ${getLinkHTMLText(HINTS_VOCAB_IDS.BLOCK, 'block')}`
}

const getMultipleHousesNakeSingleDescription = (solutionValue: SolutionValue, cell: Cell, smartHintsExplanationTexts: HintExplainationTexts): string => {
    const msgPlaceholdersValues = {
        solutionValue,
        cellAxesText: getCellAxesValues(cell),
        cellHousesText: getCellHousesText(cell),
    }
    const explainations = smartHintsExplanationTexts[HINTS_IDS.NAKED_SINGLE]
    return dynamicInterpolation(explainations.MULTIPLE_HOUSE, msgPlaceholdersValues)
}

const getCompositeHousesNakeSingleDescription = (solutionValue: SolutionValue, cell: Cell, smartHintsExplanationTexts: HintExplainationTexts): string => {
    const msgPlaceholdersValues = {
        solutionValue,
        cellAxesText: getCellAxesValues(cell),
    }
    const explaination = smartHintsExplanationTexts.composite[HINTS_IDS.NAKED_SINGLE]
    return dynamicInterpolation(explaination, msgPlaceholdersValues)
}

const SMART_HINTS_TECHNIQUES = {
    NAKED_SINGLE: {
        TITLE: HINT_ID_VS_TITLES[HINTS_IDS.NAKED_SINGLE],
        DESCRIPTION: {
            getSingleHouseMsg: getSingleHouseNakedSingleDescription,
            getMultipleHouseMsg: getMultipleHousesNakeSingleDescription,
            getCompositeHintMsg: getCompositeHousesNakeSingleDescription
        },
    },
}

const dataToHighlightHouseCells = (house: House, nakedSingleHostCell: Cell, cellsToFocusData: CellsFocusData, smartHintsColorSystem: SmartHintsColorSystem) => {
    _forEach(getHouseCells(house), (cell: Cell) => {
        const cellHighlightData = {
            bgColor: areSameCells(cell, nakedSingleHostCell)
                ? transformCellBGColor(smartHintColorSystemReader.selectedCellBGColor(smartHintsColorSystem))
                : transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)),
        }
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
    })
    return cellsToFocusData
}

const nakedSingleMixHousesDataToHighlight = (cell: Cell, smartHintsColorSystem: SmartHintsColorSystem): CellsFocusData => {
    let cellsToFocusData = {}
    cellsToFocusData = dataToHighlightHouseCells(getCellRowHouseInfo(cell), cell, cellsToFocusData, smartHintsColorSystem)
    cellsToFocusData = dataToHighlightHouseCells(getCellColHouseInfo(cell), cell, cellsToFocusData, smartHintsColorSystem)
    cellsToFocusData = dataToHighlightHouseCells(getCellBlockHouseInfo(cell), cell, cellsToFocusData, smartHintsColorSystem)
    return cellsToFocusData
}

const getApplyHintData = (rawHint: NakedSingleRawHint): AddMainNumberHintAction[] => {
    const { cell, mainNumber } = rawHint
    return [
        {
            cell,
            action: { type: BOARD_MOVES_TYPES.ADD, mainNumber },
        },
    ]
}

export const transformNakedSingleRawHint = ({ rawHint, mainNumbers, smartHintsColorSystem, smartHintsTranslationsTexts }: NakedSingleTransformerArgs): TransformedRawHint => {
    const { type, cell } = rawHint
    const { row, col } = cell
    let cellsToFocusData = {}
    let logic = ''
    switch (type) {
        case NAKED_SINGLE_TYPES.ROW:
            cellsToFocusData = dataToHighlightHouseCells(getCellRowHouseInfo(cell), cell, cellsToFocusData, smartHintsColorSystem)
            logic = SMART_HINTS_TECHNIQUES.NAKED_SINGLE.DESCRIPTION.getSingleHouseMsg(
                HOUSE_TYPE.ROW,
                MainNumbersRecord.getCellSolutionValue(mainNumbers, cell),
                cell,
                smartHintsTranslationsTexts.explanation
            )
            break
        case NAKED_SINGLE_TYPES.COL:
            cellsToFocusData = dataToHighlightHouseCells(getCellColHouseInfo(cell), cell, cellsToFocusData, smartHintsColorSystem)
            logic = SMART_HINTS_TECHNIQUES.NAKED_SINGLE.DESCRIPTION.getSingleHouseMsg(
                HOUSE_TYPE.COL,
                MainNumbersRecord.getCellSolutionValue(mainNumbers, cell),
                cell,
                smartHintsTranslationsTexts.explanation
            )
            break
        case NAKED_SINGLE_TYPES.BLOCK:
            cellsToFocusData = dataToHighlightHouseCells(getCellBlockHouseInfo(cell), cell, cellsToFocusData, smartHintsColorSystem)
            logic = SMART_HINTS_TECHNIQUES.NAKED_SINGLE.DESCRIPTION.getSingleHouseMsg(
                HOUSE_TYPE.BLOCK,
                MainNumbersRecord.getCellSolutionValue(mainNumbers, cell),
                cell,
                smartHintsTranslationsTexts.explanation
            )
            break
        case NAKED_SINGLE_TYPES.MIX:
            cellsToFocusData = nakedSingleMixHousesDataToHighlight(cell, smartHintsColorSystem)
            const getLogicHandler = rawHint.isComposite ? SMART_HINTS_TECHNIQUES.NAKED_SINGLE.DESCRIPTION.getCompositeHintMsg
                : SMART_HINTS_TECHNIQUES.NAKED_SINGLE.DESCRIPTION.getMultipleHouseMsg
            logic = getLogicHandler(MainNumbersRecord.getCellSolutionValue(mainNumbers, cell), cell, smartHintsTranslationsTexts.explanation)
            break
        default:
            break
    }

    return {
        type: HINTS_IDS.NAKED_SINGLE,
        cellsToFocusData,
        title: smartHintsTranslationsTexts.title[HINTS_IDS.NAKED_SINGLE],
        steps: [{ text: logic }],
        selectCellOnClose: { row, col },
        applyHint: getApplyHintData(rawHint),
    }
}
