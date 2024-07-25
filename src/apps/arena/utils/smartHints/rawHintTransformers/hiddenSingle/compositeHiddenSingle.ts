import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _isNil from '@lodash/isNil'

import { getLinkHTMLText } from 'src/apps/hintsVocabulary/vocabExplainations/utils'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { BOARD_MOVES_TYPES } from '../../../../constants'

import {
    areSameCells,
    getCellAxesValues,
} from '../../../util'
import { getHouseCells, getCellHouseForHouseType } from '@domain/board/utils/housesAndCells'

import { setCellDataInHintResult, transformCellBGColor } from '../../util'
import { HINTS_IDS, HOUSE_TYPE_VS_FULL_NAMES } from '../../constants'
import { COMPOSITE_HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import smartHintColorSystemReader from '../../colorSystem.reader'

import {
    AddMainNumberHintAction, CellsFocusData, SmartHintsColorSystem, TransformedRawHint,
} from '../../types'
import { HiddenSingleRawHint } from '../../hiddenSingle/types'
import { HiddenSingleTransformerArgs } from './types'
import { HOUSE_TYPE_VS_VOCAB_ID } from '../constants'

const getHiddenSingleLogic = (rawHint: HiddenSingleRawHint, solutionValue: SolutionValue) => {
    const { type: houseType, cell } = rawHint
    const msgPlaceholdersValues = {
        houseType: getLinkHTMLText(HOUSE_TYPE_VS_VOCAB_ID[houseType], HOUSE_TYPE_VS_FULL_NAMES[houseType].FULL_NAME),
        solutionValue,
        hostCell: getCellAxesValues(cell),
    }
    const msgTemplate = COMPOSITE_HINT_EXPLANATION_TEXTS[HINTS_IDS.HIDDEN_SINGLE]
    return dynamicInterpolation(msgTemplate, msgPlaceholdersValues)
}

const getApplyHintData = (rawHint: HiddenSingleRawHint): AddMainNumberHintAction[] => {
    const { cell, mainNumber } = rawHint
    return [
        {
            cell,
            action: { type: BOARD_MOVES_TYPES.ADD, mainNumber },
        },
    ]
}

const highlightHoseHouseCells = (hiddenSingle: HiddenSingleRawHint, smartHintsColorSystem: SmartHintsColorSystem) => {
    const result: CellsFocusData = {}
    getHouseCells(getCellHouseForHouseType(hiddenSingle.type, hiddenSingle.cell))
        .forEach(cell => {
            if (areSameCells(cell, hiddenSingle.cell)) {
                const cellHighlightData = {
                    bgColor: transformCellBGColor(smartHintColorSystemReader.selectedCellBGColor(smartHintsColorSystem))
                }
                setCellDataInHintResult(cell, cellHighlightData, result)
            } else {
                const cellHighlightData = {
                    bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem))
                }
                setCellDataInHintResult(cell, cellHighlightData, result)
            }
        })
    return result
}

export const transformCompositeHiddenSingleRawHint = ({ rawHint, mainNumbers, smartHintsColorSystem }: HiddenSingleTransformerArgs): TransformedRawHint => {
    const hiddenSingleCellSolutionValue = MainNumbersRecord.getCellSolutionValue(mainNumbers, rawHint.cell)
    return {
        type: HINTS_IDS.HIDDEN_SINGLE,
        cellsToFocusData: highlightHoseHouseCells(rawHint, smartHintsColorSystem),
        title: HINT_ID_VS_TITLES[HINTS_IDS.HIDDEN_SINGLE],
        steps: [{ text: getHiddenSingleLogic(rawHint, hiddenSingleCellSolutionValue) }],
        selectCellOnClose: rawHint.cell,
        applyHint: getApplyHintData(rawHint),
    }
}
