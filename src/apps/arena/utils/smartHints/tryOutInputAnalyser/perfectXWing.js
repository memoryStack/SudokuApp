import { getHouseAxesValue } from "../../util"
import { HOUSE_TYPE, HOUSE_TYPE_VS_FULL_NAMES } from "../constants"
import { TRY_OUT_RESULT_STATES } from "./constants"
import { noInputInTryOut } from "./helpers"
import { toOrdinal } from "../../../../../utils/utilities/toOrdinal"

export default ({ xWing, xWingCells, removableNotesHostCells }) => {

    if (noInputInTryOut([...xWingCells, ...removableNotesHostCells])) {
        return getNoInputResult(xWing)
    }

    return {
        msg: 'karya pragati path per h',
        state: TRY_OUT_RESULT_STATES.START,
    }
}

const getNoInputResult = (xWing) => {
    const candidate = getXWingCandidate(xWing)
    const { houseAAxesValue, houseBAxesValue } = getXWingHousesTexts(xWing.houseType, xWing.legs)
    const houseFullName = HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME_PLURAL
    return {
        msg: `try filling ${candidate} in ${houseAAxesValue} and ${houseBAxesValue} ${houseFullName}`
            + ` to understand why ${candidate} highlighted in red colors can't come there and is safe to remove`,
        state: TRY_OUT_RESULT_STATES.START,
    }
}

const getXWingCandidate = (xWing) => {
    return xWing.legs[0].candidate
}

const getXWingHousesTexts = (houseType, xWingLegs) => {
    const houseNumKey = houseType === HOUSE_TYPE.ROW ? 'row' : 'col'
    const houseANum = xWingLegs[0].cells[0][houseNumKey]
    const houseBNum = xWingLegs[1].cells[0][houseNumKey]
    const houseAAxesValue = getHouseAxesValue({ type: houseType, num: houseANum })
    const houseBAxesValue = getHouseAxesValue({ type: houseType, num: houseBNum })

    if (houseType === HOUSE_TYPE.COL) {
        return {
            houseAAxesValue: toOrdinal(parseInt(houseAAxesValue, 10)),
            houseBAxesValue: toOrdinal(parseInt(houseBAxesValue, 10)),
        }
    }
    return {
        houseAAxesValue,
        houseBAxesValue,
    }
}