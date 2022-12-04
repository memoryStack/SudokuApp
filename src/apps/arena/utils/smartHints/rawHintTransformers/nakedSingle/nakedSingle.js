import { dynamicInterpolation } from 'lodash/src/utils/dynamicInterpolation'
import _forEach from 'lodash/src/utils/forEach'

import { SMART_HINTS_CELLS_BG_COLOR, NAKED_SINGLE_TYPES, HINTS_IDS, HOUSE_TYPE_VS_FULL_NAMES, HOUSE_TYPE } from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import { setCellDataInHintResult } from '../../util'
import { areSameCells, getCellRowHouseInfo, getCellColHouseInfo, getCellBlockHouseInfo, getCellAxesValues } from '../../../util'
import { getHouseCells } from '../../../houseCells'

const getSingleHouseNakedSingleDescription = (houseType, solutionValue, cell) => {
    const msgPlaceholdersValues = {
        houseType: HOUSE_TYPE_VS_FULL_NAMES[houseType].FULL_NAME,
        solutionValue,
        cellAxesText: getCellAxesValues(cell)
    }
    const msgTemplate = HINT_EXPLANATION_TEXTS[HINTS_IDS.NAKED_SINGLE].SINGLE_HOUSE
    return dynamicInterpolation(msgTemplate, msgPlaceholdersValues)
}

const getMultipleHousesNakeSingleDescription = (solutionValue, cell) => {
    const msgPlaceholdersValues = {
        solutionValue,
        cellAxesText: getCellAxesValues(cell)
    }
    const msgTemplate = HINT_EXPLANATION_TEXTS[HINTS_IDS.NAKED_SINGLE].MULTIPLE_HOUSE
    return dynamicInterpolation(msgTemplate, msgPlaceholdersValues)
}

const SMART_HINTS_TECHNIQUES = {
    NAKED_SINGLE: {
        TITLE: HINT_ID_VS_TITLES[HINTS_IDS.NAKED_SINGLE],
        DESCRIPTION: {
            getSingleHouseMsg: (houseType, solutionValue, cell) =>
                getSingleHouseNakedSingleDescription(houseType, solutionValue, cell),
            getMultipleHouseMsg: (solutionValue, cell) => getMultipleHousesNakeSingleDescription(solutionValue, cell),
        },
    },
}

const dataToHighlightHouseCells = (house, nakedSingleHostCell, cellsToFocusData = {}) => {
    _forEach(getHouseCells(house), cell => {
        const cellHighlightData = {
            bgColor: areSameCells(cell, nakedSingleHostCell)
                ? SMART_HINTS_CELLS_BG_COLOR.SELECTED
                : SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT,
        }
        setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
    })
    return cellsToFocusData
}

const nakedSingleMixHousesDataToHighlight = cell => {
    let cellsToFocusData = dataToHighlightHouseCells(getCellRowHouseInfo(cell), cell)
    cellsToFocusData = dataToHighlightHouseCells(getCellColHouseInfo(cell), cell, cellsToFocusData)
    cellsToFocusData = dataToHighlightHouseCells(getCellBlockHouseInfo(cell), cell, cellsToFocusData)
    return cellsToFocusData
}

export const transformNakedSingleRawHint = ({ rawHint, mainNumbers }) => {
    const { type, cell } = rawHint

    const { row, col } = cell
    let cellsToFocusData = null
    let logic = ''
    switch (type) {
        case NAKED_SINGLE_TYPES.ROW:
            cellsToFocusData = dataToHighlightHouseCells(getCellRowHouseInfo(cell), cell)
            logic = SMART_HINTS_TECHNIQUES.NAKED_SINGLE.DESCRIPTION.getSingleHouseMsg(
                HOUSE_TYPE.ROW,
                mainNumbers[row][col].solutionValue,
                cell,
            )
            break
        case NAKED_SINGLE_TYPES.COL:
            cellsToFocusData = dataToHighlightHouseCells(getCellColHouseInfo(cell), cell)
            logic = SMART_HINTS_TECHNIQUES.NAKED_SINGLE.DESCRIPTION.getSingleHouseMsg(
                HOUSE_TYPE.COL,
                mainNumbers[row][col].solutionValue,
                cell,
            )
            break
        case NAKED_SINGLE_TYPES.BLOCK:
            cellsToFocusData = dataToHighlightHouseCells(getCellBlockHouseInfo(cell), cell)
            logic = SMART_HINTS_TECHNIQUES.NAKED_SINGLE.DESCRIPTION.getSingleHouseMsg(
                HOUSE_TYPE.BLOCK,
                mainNumbers[row][col].solutionValue,
                cell,
            )
            break
        case NAKED_SINGLE_TYPES.MIX:
            cellsToFocusData = nakedSingleMixHousesDataToHighlight(cell)
            logic = SMART_HINTS_TECHNIQUES.NAKED_SINGLE.DESCRIPTION.getMultipleHouseMsg(
                mainNumbers[row][col].solutionValue,
                cell,
            )
    }

    return {
        cellsToFocusData,
        title: SMART_HINTS_TECHNIQUES.NAKED_SINGLE.TITLE,
        steps: [{ text: logic }],
        selectCellOnClose: { row, col },
    }
}
