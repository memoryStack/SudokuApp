import { getCellAxesValues, getHouseAxesValue, isCellEmpty, isCellNoteVisible, getCellRowHouseInfo, getCellColHouseInfo } from "../../util"
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, HOUSE_TYPE, HOUSE_TYPE_VS_FULL_NAMES } from "../constants"
import { TRY_OUT_RESULT_STATES } from "./constants"
import { getCellsAxesList, noInputInTryOut, getCellsAxesValuesListText } from "./helpers"
import { toOrdinal } from "../../../../../utils/utilities/toOrdinal"
import _flatten from "../../../../../utils/utilities/flatten"
import { getTryOutMainNumbers, getTryOutNotes } from "../../../store/selectors/smartHintHC.selectors"
import { getStoreState } from "../../../../../redux/dispatch.helpers"
import { getCrossHouseType } from "../xWing/utils"

export default ({ xWing, xWingCells, removableNotesHostCells }) => {

    if (noInputInTryOut([...xWingCells, ...removableNotesHostCells])) {
        return getNoInputResult(xWing)
    }

    if (filterFilledCells(removableNotesHostCells).length) {
        return getRemovableNoteHostCellFilledResult(xWing, removableNotesHostCells)
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
    const { houseANum, houseBNum, } = getXWingHousesNums(houseType, xWingLegs)
    return {
        houseAAxesValue: getHouseAxesText({ type: houseType, num: houseANum }),
        houseBAxesValue: getHouseAxesText({ type: houseType, num: houseBNum }),
    }
}

const getXWingHousesNums = (houseType, xWingLegs) => {
    const houseInfoGetterHandler = houseType === HOUSE_TYPE.ROW ? getCellRowHouseInfo : getCellColHouseInfo
    return {
        houseANum: houseInfoGetterHandler(xWingLegs[0].cells[0]).num,
        houseBNum: houseInfoGetterHandler(xWingLegs[1].cells[0]).num,
    }
}

const filterFilledCells = (removableNotesHostCells) => {
    const mainNumbers = getTryOutMainNumbers(getStoreState())
    return removableNotesHostCells.filter((cell) => {
        return !isCellEmpty(cell, mainNumbers)
    })
}

const getRemovableNoteHostCellFilledResult = (xWing, removableNotesHostCells) => {
    const xWingCells = getXWingCells(xWing.legs)
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

    return getOneRemovableNoteCellFilledErrorResult(xWing)
}

const getXWingCells = (xWingLegs) => {
    return _flatten(xWingLegs.map(leg => leg.cells))
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

const getOneRemovableNoteCellFilledErrorResult = (xWing) => {
    const xWingCells = getXWingCells(xWing.legs)
    const candidate = getXWingCandidate(xWing)

    const xWingCellsWithCandidateAsNote = filterCellsWithXWingCandidateAsNote(xWingCells, candidate)
    const xWingHostCellsTexts = getCellsAxesValuesListText(xWingCellsWithCandidateAsNote, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND)

    const crossHouseType = getCrossHouseType(xWing.houseType)
    const crossHouse = crossHouseType === HOUSE_TYPE.ROW ? getCellRowHouseInfo(xWingCellsWithCandidateAsNote[0]) :
        getCellColHouseInfo(xWingCellsWithCandidateAsNote[0])

    const { houseAAxesValue, houseBAxesValue } = getXWingHousesTexts(xWing.houseType, xWing.legs)
    return {
        msg: `now to fill ${candidate} in ${houseAAxesValue} and ${houseBAxesValue}`
            + ` ${HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME_PLURAL} we have`
            + ` two cells ${xWingHostCellsTexts} but both of these cells are in`
            + ` same ${getHouseAxesText(crossHouse)} ${HOUSE_TYPE_VS_FULL_NAMES[crossHouseType].FULL_NAME}.`,
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
    return toOrdinal(parseInt(houseAxesValue), 10)
}
