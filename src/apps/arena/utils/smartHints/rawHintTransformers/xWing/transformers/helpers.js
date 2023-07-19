import { toOrdinal } from '@lodash/toOrdinal'
import _map from '@lodash/map'

import { BOARD_MOVES_TYPES } from '../../../../../constants'

import { getCellHouseForHouseType, getHouseAxesValue } from '../../../../util'

import { HOUSE_TYPE, HOUSE_TYPE_VS_FULL_NAMES } from '../../../constants'
import { getCrossHouseType } from '../../../xWing/utils'
import { getCellsAxesValuesListText } from '../../helpers'

export const getXWingHouseFullName = xWing => HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME

export const getXWingHouseFullNamePlural = xWing => HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME_PLURAL

export const getXWingCrossHouseFullName = xWing => HOUSE_TYPE_VS_FULL_NAMES[getCrossHouseType(xWing.houseType)].FULL_NAME

export const getXWingCrossHouseFullNamePlural = xWing => HOUSE_TYPE_VS_FULL_NAMES[getCrossHouseType(xWing.houseType)].FULL_NAME_PLURAL

export const getXWingHousesTexts = (houseType, xWingLegs) => {
    const { houseANum, houseBNum } = getXWingHousesNums(houseType, xWingLegs)
    return {
        houseAAxesValue: getHouseAxesText({ type: houseType, num: houseANum }),
        houseBAxesValue: getHouseAxesText({ type: houseType, num: houseBNum }),
    }
}

const getXWingHousesNums = (houseType, xWingLegs) => ({
    houseANum: getCellHouseForHouseType(houseType, xWingLegs[0].cells[0]).num,
    houseBNum: getCellHouseForHouseType(houseType, xWingLegs[1].cells[0]).num,
})

export const getHouseAxesText = house => {
    const houseAxesValue = getHouseAxesValue(house)
    if (house.type === HOUSE_TYPE.ROW) return houseAxesValue
    return toOrdinal(parseInt(houseAxesValue, 10))
}

export const getCrossHouseAxesText = xWing => {
    const crossHouseType = getCrossHouseType(xWing.houseType)
    const { crossHouseANum, crossHouseBNum } = getCrossHousesNums(xWing)
    return {
        crossHouseAAxesValue: getHouseAxesText({ type: crossHouseType, num: crossHouseANum }),
        crossHouseBAxesValue: getHouseAxesText({ type: crossHouseType, num: crossHouseBNum }),
    }
}

const getCrossHousesNums = xWing => {
    const crossHouseType = getCrossHouseType(xWing.houseType)
    return {
        crossHouseANum: getCellHouseForHouseType(crossHouseType, xWing.legs[0].cells[0]).num,
        crossHouseBNum: getCellHouseForHouseType(crossHouseType, xWing.legs[0].cells[1]).num,
    }
}

export const getDiagonalsCornersAxesTexts = xWing => {
    const {
        topLeft, topRight, bottomLeft, bottomRight,
    } = getXWingCornerCells(xWing)
    return {
        topDown: getCellsAxesValuesListText([topLeft, bottomRight]),
        bottomUp: getCellsAxesValuesListText([bottomLeft, topRight]),
    }
}

export const getXWingCornerCells = xWing => {
    const { houseType } = xWing
    const xWingLegs = xWing.legs
    return {
        topLeft: xWingLegs[0].cells[0],
        topRight: houseType === HOUSE_TYPE.COL ? xWingLegs[1].cells[0] : xWingLegs[0].cells[1],
        bottomLeft: houseType === HOUSE_TYPE.COL ? xWingLegs[0].cells[1] : xWingLegs[1].cells[0],
        bottomRight: xWingLegs[1].cells[1],
    }
}

export const getApplyHintData = (candidate, removableNotesHostCells) => _map(removableNotesHostCells, cell => ({
    cell,
    action: { type: BOARD_MOVES_TYPES.REMOVE, notes: [candidate] },
}))
