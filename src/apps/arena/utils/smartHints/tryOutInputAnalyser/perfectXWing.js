import { getHouseAxesValue, isCellEmpty } from "../../util"
import { HOUSE_TYPE, HOUSE_TYPE_VS_FULL_NAMES } from "../constants"
import { TRY_OUT_RESULT_STATES } from "./constants"
import { noInputInTryOut } from "./helpers"
import { toOrdinal } from "../../../../../utils/utilities/toOrdinal"
import { getTryOutMainNumbers } from "../../../store/selectors/smartHintHC.selectors"
import { getStoreState } from "../../../../../redux/dispatch.helpers"

export default ({ xWing, xWingCells, removableNotesHostCells }) => {

    if (noInputInTryOut([...xWingCells, ...removableNotesHostCells])) {
        return getNoInputResult(xWing)
    }

    if (filterFilledCells(removableNotesHostCells).length) {
        return getRemovableNoteHostCellFilledResult(xWing, xWingCells, removableNotesHostCells)
    }

    //  todo: one or two correct cells are filled

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

const filterFilledCells = (removableNotesHostCells) => {
    const mainNumbers = getTryOutMainNumbers(getStoreState())
    return removableNotesHostCells.filter((cell) => {
        return !isCellEmpty(cell, mainNumbers)
    })
}

const getRemovableNoteHostCellFilledResult = (xWing, xWingCells, removableNotesHostCells) => {
    const removableNotesHostCellsFilledCount = filterFilledCells(removableNotesHostCells).length
    if (removableNotesHostCellsFilledCount === 2) {
        return getBothHouseWithoutCandidateErrorResult(xWing)
    }

    const xWingFilledCellsCount = filterFilledCells(xWingCells).length
    if (xWingFilledCellsCount) {
        // 1 wrong filled and 1 correctly filled
        return {
            msg: 'ek sahi or ek glt h',
            state: TRY_OUT_RESULT_STATES.ERROR,
        }
    }

    // only one wrongly cell is filled

    return {
        msg: '1 glti kiya ntkht',
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const getBothHouseWithoutCandidateErrorResult = (xWing) => {
    const { houseAAxesValue, houseBAxesValue } = getXWingHousesTexts(xWing.houseType, xWing.legs)
    const candidate = getXWingCandidate(xWing)
    const houseFullName = HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME_PLURAL
    return {
        msg: `there is no cell in ${houseAAxesValue} and ${houseBAxesValue} ${houseFullName} where ${candidate} can come`,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}
