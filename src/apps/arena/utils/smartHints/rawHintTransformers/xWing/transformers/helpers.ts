import { toOrdinal } from '@lodash/toOrdinal'
import _map from '@lodash/map'

import { Houses } from '../../../../classes/houses'
import { BOARD_MOVES_TYPES } from '../../../../../constants'

import { getCellHouseForHouseType, getHouseAxesValue } from '../../../../util'

import { HOUSE_TYPE_VS_FULL_NAMES } from '../../../constants'
import { getCrossHouseType } from '../../../xWing/utils'
import { getCellsAxesValuesListText } from '../../helpers'
import { XWingLegs, XWingRawHint } from '../../../xWing/types'
import { NotesRemovalHintAction } from '../../../types'

export const getXWingHouseFullName = (xWing: XWingRawHint) => HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME

export const getXWingHouseFullNamePlural = (xWing: XWingRawHint) => HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME_PLURAL

export const getXWingCrossHouseFullName = (xWing: XWingRawHint) => HOUSE_TYPE_VS_FULL_NAMES[getCrossHouseType(xWing.houseType)].FULL_NAME

export const getXWingCrossHouseFullNamePlural = (xWing: XWingRawHint) => HOUSE_TYPE_VS_FULL_NAMES[getCrossHouseType(xWing.houseType)].FULL_NAME_PLURAL

export const getXWingHousesTexts = (houseType: HouseType, xWingLegs: XWingLegs) => {
    const { houseANum, houseBNum } = getXWingHousesNums(houseType, xWingLegs)
    return {
        houseAAxesValue: getHouseAxesText({ type: houseType, num: houseANum }),
        houseBAxesValue: getHouseAxesText({ type: houseType, num: houseBNum }),
    }
}

const getXWingHousesNums = (houseType: HouseType, xWingLegs: XWingLegs) => ({
    houseANum: getCellHouseForHouseType(houseType, xWingLegs[0].cells[0]).num,
    houseBNum: getCellHouseForHouseType(houseType, xWingLegs[1].cells[0]).num,
})

export const getHouseAxesText = (house: House) => {
    const houseAxesValue = getHouseAxesValue(house)
    if (Houses.isRowHouse(house.type)) return houseAxesValue
    return toOrdinal(parseInt(houseAxesValue, 10))
}

export const getCrossHouseAxesText = (xWing: XWingRawHint) => {
    const crossHouseType = getCrossHouseType(xWing.houseType)
    const { crossHouseANum, crossHouseBNum } = getCrossHousesNums(xWing)
    return {
        crossHouseAAxesValue: getHouseAxesText({ type: crossHouseType, num: crossHouseANum }),
        crossHouseBAxesValue: getHouseAxesText({ type: crossHouseType, num: crossHouseBNum }),
    }
}

const getCrossHousesNums = (xWing: XWingRawHint) => {
    const crossHouseType = getCrossHouseType(xWing.houseType)
    return {
        crossHouseANum: getCellHouseForHouseType(crossHouseType, xWing.legs[0].cells[0]).num,
        crossHouseBNum: getCellHouseForHouseType(crossHouseType, xWing.legs[0].cells[1]).num,
    }
}

export const getDiagonalsCornersAxesTexts = (xWing: XWingRawHint) => {
    const {
        topLeft, topRight, bottomLeft, bottomRight,
    } = getXWingCornerCells(xWing)
    return {
        topDown: getCellsAxesValuesListText([topLeft, bottomRight]),
        bottomUp: getCellsAxesValuesListText([bottomLeft, topRight]),
    }
}

export const getXWingCornerCells = (xWing: XWingRawHint) => {
    const { houseType } = xWing
    const xWingLegs = xWing.legs
    return {
        topLeft: xWingLegs[0].cells[0],
        topRight: Houses.isColHouse(houseType) ? xWingLegs[1].cells[0] : xWingLegs[0].cells[1],
        bottomLeft: Houses.isColHouse(houseType) ? xWingLegs[0].cells[1] : xWingLegs[1].cells[0],
        bottomRight: xWingLegs[1].cells[1],
    }
}

export const getApplyHintData = (
    candidate: NoteValue,
    removableNotesHostCells: Cell[],
): NotesRemovalHintAction[] => _map(removableNotesHostCells, (cell: Cell) => ({
    cell,
    action: { type: BOARD_MOVES_TYPES.REMOVE, notes: [candidate] },
}))