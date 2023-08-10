import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'

import { MainNumbersRecord } from '../../../../RecordUtilities/boardMainNumbers'
import {
    SMART_HINTS_CELLS_BG_COLOR,
    NAKED_SINGLE_TYPES,
    HINTS_IDS,
    HOUSE_TYPE_VS_FULL_NAMES,
    HOUSE_TYPE,
} from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import { setCellDataInHintResult, transformCellBGColor } from '../../util'
import {
    areSameCells,
    getCellRowHouseInfo,
    getCellColHouseInfo,
    getCellBlockHouseInfo,
    getCellAxesValues,
} from '../../../util'
import { getHouseCells } from '../../../houseCells'
import { BOARD_MOVES_TYPES } from '../../../../constants'
import smartHintColorSystemReader from '../../colorSystemReader'

const getSingleHouseNakedSingleDescription = (houseType, solutionValue, cell) => {
    const msgPlaceholdersValues = {
        houseType: HOUSE_TYPE_VS_FULL_NAMES[houseType].FULL_NAME,
        solutionValue,
        cellAxesText: getCellAxesValues(cell),
    }
    const msgTemplate = HINT_EXPLANATION_TEXTS[HINTS_IDS.NAKED_SINGLE].SINGLE_HOUSE
    return dynamicInterpolation(msgTemplate, msgPlaceholdersValues)
}

const getMultipleHousesNakeSingleDescription = (solutionValue, cell) => {
    const msgPlaceholdersValues = {
        solutionValue,
        cellAxesText: getCellAxesValues(cell),
    }
    const msgTemplate = HINT_EXPLANATION_TEXTS[HINTS_IDS.NAKED_SINGLE].MULTIPLE_HOUSE
    return dynamicInterpolation(msgTemplate, msgPlaceholdersValues)
}

const SMART_HINTS_TECHNIQUES = {
    NAKED_SINGLE: {
        TITLE: HINT_ID_VS_TITLES[HINTS_IDS.NAKED_SINGLE],
        DESCRIPTION: {
            getSingleHouseMsg: (houseType, solutionValue, cell) => getSingleHouseNakedSingleDescription(houseType, solutionValue, cell),
            getMultipleHouseMsg: (solutionValue, cell) => getMultipleHousesNakeSingleDescription(solutionValue, cell),
        },
    },
}

const dataToHighlightHouseCells = (house, nakedSingleHostCell, cellsToFocusData, smartHintsColorSystem) => {
    _forEach(getHouseCells(house), cell => {
        const cellHighlightData = {
            bgColor: areSameCells(cell, nakedSingleHostCell)
                ? SMART_HINTS_CELLS_BG_COLOR.SELECTED
                : transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)),
        }
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
    })
    return cellsToFocusData
}

const nakedSingleMixHousesDataToHighlight = (cell, smartHintsColorSystem) => {
    let cellsToFocusData = {}
    cellsToFocusData = dataToHighlightHouseCells(getCellRowHouseInfo(cell), cell, cellsToFocusData, smartHintsColorSystem)
    cellsToFocusData = dataToHighlightHouseCells(getCellColHouseInfo(cell), cell, cellsToFocusData, smartHintsColorSystem)
    cellsToFocusData = dataToHighlightHouseCells(getCellBlockHouseInfo(cell), cell, cellsToFocusData, smartHintsColorSystem)
    return cellsToFocusData
}

const getApplyHintData = rawHint => {
    const { cell, mainNumber } = rawHint
    return [
        {
            cell,
            action: { type: BOARD_MOVES_TYPES.ADD, mainNumber },
        },
    ]
}

export const transformNakedSingleRawHint = ({ rawHint, mainNumbers, smartHintsColorSystem }) => {
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
            )
            break
        case NAKED_SINGLE_TYPES.COL:
            cellsToFocusData = dataToHighlightHouseCells(getCellColHouseInfo(cell), cell, cellsToFocusData, smartHintsColorSystem)
            logic = SMART_HINTS_TECHNIQUES.NAKED_SINGLE.DESCRIPTION.getSingleHouseMsg(
                HOUSE_TYPE.COL,
                MainNumbersRecord.getCellSolutionValue(mainNumbers, cell),
                cell,
            )
            break
        case NAKED_SINGLE_TYPES.BLOCK:
            cellsToFocusData = dataToHighlightHouseCells(getCellBlockHouseInfo(cell), cell, cellsToFocusData, smartHintsColorSystem)
            logic = SMART_HINTS_TECHNIQUES.NAKED_SINGLE.DESCRIPTION.getSingleHouseMsg(
                HOUSE_TYPE.BLOCK,
                MainNumbersRecord.getCellSolutionValue(mainNumbers, cell),
                cell,
            )
            break
        case NAKED_SINGLE_TYPES.MIX:
            cellsToFocusData = nakedSingleMixHousesDataToHighlight(cell, smartHintsColorSystem)
            logic = SMART_HINTS_TECHNIQUES.NAKED_SINGLE.DESCRIPTION.getMultipleHouseMsg(
                MainNumbersRecord.getCellSolutionValue(mainNumbers, cell),
                cell,
            )
            break
        default:
            break
    }

    return {
        cellsToFocusData,
        title: SMART_HINTS_TECHNIQUES.NAKED_SINGLE.TITLE,
        steps: [{ text: logic }],
        selectCellOnClose: { row, col },
        applyHint: getApplyHintData(rawHint),
    }
}
