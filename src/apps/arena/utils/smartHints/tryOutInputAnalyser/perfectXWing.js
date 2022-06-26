import { getCellAxesValues, getHouseAxesValue, isCellEmpty, isCellNoteVisible, getCellRowHouseInfo, getCellColHouseInfo } from "../../util"
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, HOUSE_TYPE, HOUSE_TYPE_VS_FULL_NAMES } from "../constants"
import { TRY_OUT_RESULT_STATES } from "./constants"
import { getCellsAxesList, noInputInTryOut, getCellsAxesValuesListText } from "./helpers"
import { toOrdinal } from "../../../../../utils/utilities/toOrdinal"
import { getTryOutMainNumbers, getTryOutNotes } from "../../../store/selectors/smartHintHC.selectors"
import { getStoreState } from "../../../../../redux/dispatch.helpers"
import { getCrossHouseType } from "../xWing/utils"

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
    const houseNumKey = houseType === HOUSE_TYPE.ROW ? 'row' : 'col' // TODO: this can be refactored. we have utils for this
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

    // write a func to extract xWing cells from xWing to reduce the number of args from here
    return xx_get(xWing, xWingCells)
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

const xx_get = (xWing, xWingCells) => {
    // identify xWingCells have candidate in them even now
    const { houseAAxesValue, houseBAxesValue } = getXWingHousesTexts(xWing.houseType, xWing.legs)

    const candidate = getXWingCandidate(xWing)

    const houseFullName = HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME_PLURAL

    const crossHouseType = getCrossHouseType(xWing.houseType)
    const crossHouseTypeFullName = HOUSE_TYPE_VS_FULL_NAMES[crossHouseType].FULL_NAME

    const xWingCellsWithCandidateAsNote = filterCellsWithXWingCandidateAsNote(xWingCells, candidate)
    const xWingHostCellsTexts = getCellsAxesValuesListText(xWingCellsWithCandidateAsNote, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND)

    const crossHouse = crossHouseType === HOUSE_TYPE.ROW ? getCellRowHouseInfo(xWingCellsWithCandidateAsNote[0]) :
        getCellColHouseInfo(xWingCellsWithCandidateAsNote[0])
    const crossHouseAxesText = getHouseAxesText(crossHouse)

    return {
        msg: `now to fill ${candidate} in ${houseAAxesValue} and ${houseBAxesValue} ${houseFullName} we have two cells ${xWingHostCellsTexts}`
            + ` but both of these cells are in same ${crossHouseAxesText} ${crossHouseTypeFullName}.`,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const filterCellsWithXWingCandidateAsNote = (cells, candidate) => {
    const notes = getTryOutNotes(getStoreState())
    return cells.filter((cell) => {
        return isCellNoteVisible(candidate, notes[cell.row][cell.col])
    })
}

const getHouseAxesText = (house) => {
    const houseAxesValue = getHouseAxesValue(house)
    if (house.type === HOUSE_TYPE.ROW) return houseAxesValue
    return toOrdinal(parseInt(crossHouseNum), 10)
}