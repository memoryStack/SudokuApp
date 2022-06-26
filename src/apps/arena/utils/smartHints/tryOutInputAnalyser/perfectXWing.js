import { isCellEmpty, isCellNoteVisible, getCellHouseInfo } from "../../util"
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, HOUSE_TYPE_VS_FULL_NAMES } from "../constants"
import { TRY_OUT_RESULT_STATES } from "./constants"
import { noInputInTryOut, getCellsAxesValuesListText } from "./helpers"
import _flatten from "../../../../../utils/utilities/flatten"
import { getTryOutMainNumbers, getTryOutNotes } from "../../../store/selectors/smartHintHC.selectors"
import { getStoreState } from "../../../../../redux/dispatch.helpers"
import { getCrossHouseType, getXWingHousesTexts, getHouseAxesText, getXWingCandidate } from "../xWing/utils"

export default ({ xWing, xWingCells, removableNotesHostCells }) => {

    if (noInputInTryOut([...xWingCells, ...removableNotesHostCells])) {
        return getNoInputResult(xWing)
    }

    if (filterFilledCells(removableNotesHostCells).length) {
        return getRemovableNoteHostCellFilledResult(xWing, removableNotesHostCells)
    }

    return getXWingCellsFilledResult(xWing)
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
        return getOneXWingCellAndOneRemovableNoteHostCellFilled(xWing)
    }

    return getOneRemovableNoteCellFilledErrorResult(xWing)
}

const getXWingCellsFilledResult = (xWing) => {
    const xWingCells = getXWingCells(xWing.legs)
    const filledXWingCells = filterFilledCells(xWingCells)

    if (filledXWingCells.length === 1) {
        return getOneCornorFilledResult(xWing, filledXWingCells)
    }
    return getBothCornorsFilledResult(xWing)
}

const getOneCornorFilledResult = (xWing, filledXWingCells) => {
    const candidate = getXWingCandidate(xWing)
    const houseFullName = getXWingHouseFullName(xWing)

    const filledLegHouse = getCellHouseInfo(xWing.houseType, filledXWingCells[0])
    const houseAxesText = getHouseAxesText(filledLegHouse)
    return {
        msg: `${candidate} is filled in ${houseAxesText} ${houseFullName} without any error, try filling it`
            + ` in other places as well where it is highlighted in red or green color`,
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

const getBothCornorsFilledResult = (xWing) => {
    const candidate = getXWingCandidate(xWing)
    const houseFullName = getXWingHouseFullNamePlural(xWing)
    const { houseAAxesValue, houseBAxesValue } = getXWingHousesTexts(xWing.houseType, xWing.legs)
    return {
        msg: `${candidate} is filled in ${houseAAxesValue} and ${houseBAxesValue} ${houseFullName} without`
            + ` any error, and all the ${candidate} highlighted in red color are removed`,
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
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

const getOneXWingCellAndOneRemovableNoteHostCellFilled = (xWing) => {
    const candidate = getXWingCandidate(xWing)
    const xWingLegWithCandidateAsInhabitable = getCandidateInhabitableLeg(candidate, xWing.legs)
    const inhabitableHouseAxesText = getHouseAxesText(getCellHouseInfo(xWing.houseType, xWingLegWithCandidateAsInhabitable.cells[0]))
    return {
        msg: `there is no cell in ${inhabitableHouseAxesText} ${getXWingHouseFullNamePlural(xWing)}`
            + ` where ${candidate} can come`,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const getCandidateInhabitableLeg = (candidate, xWingLegs) => {
    const mainNumbers = getTryOutMainNumbers(getStoreState())
    const notes = getTryOutNotes(getStoreState())
    return xWingLegs.find(({ cells: legXWingCells }) => {
        return legXWingCells.every((xWingCell) => {
            return isCellEmpty(xWingCell, mainNumbers) && !isCellNoteVisible(candidate, notes[xWingCell.row][xWingCell.col])
        })
    })
}

const getXWingHouseFullNamePlural = (xWing) => {
    return HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME_PLURAL
}

const getXWingHouseFullName = (xWing) => {
    return HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME
}

const getOneRemovableNoteCellFilledErrorResult = (xWing) => {
    const xWingCells = getXWingCells(xWing.legs)
    const candidate = getXWingCandidate(xWing)

    const xWingCellsWithCandidateAsNote = filterCellsWithXWingCandidateAsNote(xWingCells, candidate)
    const xWingHostCellsTexts = getCellsAxesValuesListText(xWingCellsWithCandidateAsNote, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND)

    const crossHouseType = getCrossHouseType(xWing.houseType)
    const crossHouse = getCellHouseInfo(crossHouseType, xWingCellsWithCandidateAsNote[0])

    const { houseAAxesValue, houseBAxesValue } = getXWingHousesTexts(xWing.houseType, xWing.legs)
    return {
        msg: `now to fill ${candidate} in ${houseAAxesValue} and ${houseBAxesValue}`
            + ` ${HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME_PLURAL} we have`
            + ` two cells ${xWingHostCellsTexts} but both of these cells are in`
            + ` same ${HOUSE_TYPE_VS_FULL_NAMES[crossHouseType].FULL_NAME} which is ${getHouseAxesText(crossHouse)}`,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const filterCellsWithXWingCandidateAsNote = (cells, candidate) => {
    const notes = getTryOutNotes(getStoreState())
    return cells.filter((cell) => {
        return isCellNoteVisible(candidate, notes[cell.row][cell.col])
    })
}
