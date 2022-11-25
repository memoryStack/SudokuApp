import { getStoreState } from "../../../../../../redux/dispatch.helpers"

import { getMainNumbers } from "../../../../store/selectors/board.selectors"
import { getTryOutMainNumbers, getTryOutNotes } from "../../../../store/selectors/smartHintHC.selectors"

import { getCellHouseInfo, isCellEmpty, isCellNoteVisible } from "../../../util"

import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, HOUSE_TYPE_VS_FULL_NAMES } from "../../constants"
import {
    getCrossHouseType,
    getXWingCandidate,
    getXWingCells,
    getXWingHousesTexts,
    getHouseAxesText,
    getXWingHouseFullName,
    getXWingHouseFullNamePlural,
} from "../../xWing/utils"

import { TRY_OUT_RESULT_STATES } from "../constants"
// TODO: do something about this handler. looks like it's not in right place
import { getCellsAxesValuesListText, filterFilledCellsInTryOut } from "../helpers"

export const getNoInputResult = xWing => {
    const candidate = getXWingCandidate(xWing)
    const { houseAAxesValue, houseBAxesValue } = getXWingHousesTexts(xWing.houseType, xWing.legs)
    // TODO: use already made util for this
    const houseFullName = HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME_PLURAL
    return {
        msg:
            `try filling ${candidate} in ${houseAAxesValue} and ${houseBAxesValue} ${houseFullName}` +
            ` to understand why all ${candidate} highlighted in red color can't come there and is safe to remove`,
        state: TRY_OUT_RESULT_STATES.START,
    }
}

export const getSameCrossHouseCandidatePossibilitiesResult = xWing => {
    const xWingCells = getXWingCells(xWing.legs)
    const candidate = getXWingCandidate(xWing)

    const xWingCellsWithCandidateAsNote = filterCellsWithXWingCandidateAsNote(xWingCells, candidate)
    const xWingHostCellsTexts = getCellsAxesValuesListText(
        xWingCellsWithCandidateAsNote,
        HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND,
    )

    const crossHouseType = getCrossHouseType(xWing.houseType)
    const crossHouse = getCellHouseInfo(crossHouseType, xWingCellsWithCandidateAsNote[0])

    const { houseAAxesValue, houseBAxesValue } = getXWingHousesTexts(xWing.houseType, xWing.legs)
    return {
        msg:
            `now to fill ${candidate} in ${houseAAxesValue} and ${houseBAxesValue}` +
            ` ${HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME_PLURAL} we have` +
            ` two cells ${xWingHostCellsTexts} but both of these cells are in` +
            ` ${getHouseAxesText(crossHouse)} ${HOUSE_TYPE_VS_FULL_NAMES[crossHouseType].FULL_NAME} `,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const filterCellsWithXWingCandidateAsNote = (cells, candidate) => {
    const notes = getTryOutNotes(getStoreState())
    return cells.filter(cell => {
        return isCellNoteVisible(candidate, notes[cell.row][cell.col])
    })
}

export const getOneLegWithNoCandidateResult = xWing => {
    const candidate = getXWingCandidate(xWing)
    const xWingLegWithCandidateAsInhabitable = getCandidateInhabitableLeg(candidate, xWing.legs)
    const inhabitableHouseAxesText = getHouseAxesText(
        getCellHouseInfo(xWing.houseType, xWingLegWithCandidateAsInhabitable.cells[0]),
    )

    return {
        msg:
            `there is no cell in ${inhabitableHouseAxesText} ${getXWingHouseFullName(xWing)}` +
            ` where ${candidate} can come`,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const getCandidateInhabitableLeg = (candidate, xWingLegs) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())
    const notes = getTryOutNotes(getStoreState())
    return xWingLegs.find(({ cells: legXWingCells }) => {
        return legXWingCells.every(xWingCell => {
            // handles sashimi finned x-wing as well
            return (
                (isCellEmpty(xWingCell, tryOutMainNumbers) || !isCellEmpty(xWingCell, mainNumbers)) &&
                !isCellNoteVisible(candidate, notes[xWingCell.row][xWingCell.col])
            )
        })
    })
}

// used in try-out ananlysers
export const getLegsFilledWithoutErrorResult = xWing => {
    const xWingCells = getXWingCells(xWing.legs)
    const filledXWingCells = filterFilledCellsInTryOut(xWingCells)

    if (filledXWingCells.length === 1) {
        return getOneLegFilledWithoutErrorResult(xWing)
    }
    return getBothLegsFilledWithoutErrorResult(xWing)
}

// move with above handler
const getOneLegFilledWithoutErrorResult = xWing => {
    const candidate = getXWingCandidate(xWing)
    const houseFullName = getXWingHouseFullName(xWing)

    const filledXWingCells = filterFilledCellsInTryOut(getXWingCells(xWing.legs))

    const filledLegHouse = getCellHouseInfo(xWing.houseType, filledXWingCells[0])
    const houseAxesText = getHouseAxesText(filledLegHouse)
    return {
        msg:
            `${candidate} is filled in ${houseAxesText} ${houseFullName} without any error, try filling it` +
            ` in other places as well where it is highlighted in red or green color`,
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

const getBothLegsFilledWithoutErrorResult = xWing => {
    const candidate = getXWingCandidate(xWing)
    const houseFullName = getXWingHouseFullNamePlural(xWing)
    const { houseAAxesValue, houseBAxesValue } = getXWingHousesTexts(xWing.houseType, xWing.legs)
    return {
        msg:
            `${candidate} is filled in ${houseAAxesValue} and ${houseBAxesValue} ${houseFullName} without error` +
            ` and all the red colored ${candidate}s are also removed.`,
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}
