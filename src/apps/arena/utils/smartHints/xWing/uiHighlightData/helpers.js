import { HOUSE_TYPE_VS_FULL_NAMES } from "../../constants"
import { getCrossHouseType } from "../utils"

export const getXWingHouseFullName = xWing => {
    return HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME
}

export const getXWingHouseFullNamePlural = xWing => {
    return HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME_PLURAL
}

export const getXWingCrossHouseFullName = xWing => {
    return HOUSE_TYPE_VS_FULL_NAMES[getCrossHouseType(xWing.houseType)].FULL_NAME
}

export const getXWingCrossHouseFullNamePlural = xWing => {
    return HOUSE_TYPE_VS_FULL_NAMES[getCrossHouseType(xWing.houseType)].FULL_NAME_PLURAL
}
