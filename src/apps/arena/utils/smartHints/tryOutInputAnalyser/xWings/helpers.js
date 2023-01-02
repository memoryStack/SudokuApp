import _isEmpty from 'lodash/src/utils/isEmpty'
import { dynamicInterpolation } from 'lodash/src/utils/dynamicInterpolation'

import { getStoreState } from '../../../../../../redux/dispatch.helpers'

import { getMainNumbers } from '../../../../store/selectors/board.selectors'
import { getTryOutMainNumbers, getTryOutNotes } from '../../../../store/selectors/smartHintHC.selectors'

import { getCellHouseInfo, isCellEmpty, isCellNoteVisible } from '../../../util'

import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'

import { getCellsAxesValuesListText } from '../../rawHintTransformers/helpers'
import {
    getHouseAxesText,
    getXWingCrossHouseFullName,
    getXWingHouseFullName,
    getXWingHouseFullNamePlural,
    getXWingHousesTexts,
} from '../../rawHintTransformers/xWing/transformers/helpers'

import { getCrossHouseType, getXWingCandidate, getXWingCells } from '../../xWing/utils'

import { TRY_OUT_RESULT_STATES } from '../constants'
// TODO: do something about this handler. looks like it's not in right place
import { filterFilledCellsInTryOut } from '../helpers'
import { XWING } from '../stringLiterals'

export const getNoInputResult = xWing => {
    const msgPlaceholdersValues = {
        candidate: getXWingCandidate(xWing),
        ...getXWingHousesTexts(xWing.houseType, xWing.legs),
        houseFullName: getXWingHouseFullNamePlural(xWing),
    }
    return {
        msg: dynamicInterpolation(XWING.NO_INPUT, msgPlaceholdersValues),
        state: TRY_OUT_RESULT_STATES.START,
    }
}

export const getSameCrossHouseCandidatePossibilitiesResult = xWing => {
    const candidate = getXWingCandidate(xWing)
    const xWingCellsWithCandidateAsNote = filterCellsWithXWingCandidateAsNote(getXWingCells(xWing.legs), candidate)

    const msgPlaceholdersValues = {
        candidate,
        ...getXWingHousesTexts(xWing.houseType, xWing.legs),
        houseFullNamePlural: getXWingHouseFullNamePlural(xWing),
        xWingHostCellsTexts: getCellsAxesValuesListText(
            xWingCellsWithCandidateAsNote,
            HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND,
        ),
        crossHouse: getHouseAxesText(
            getCellHouseInfo(getCrossHouseType(xWing.houseType), xWingCellsWithCandidateAsNote[0]),
        ),
        crossHouseFullName: getXWingCrossHouseFullName(xWing),
    }

    return {
        msg: dynamicInterpolation(XWING.SAME_CROSSHOUSE, msgPlaceholdersValues),
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
    if (_isEmpty(xWingLegWithCandidateAsInhabitable)) return null

    const msgPlaceholdersValues = {
        candidate,
        houseFullName: getXWingHouseFullName(xWing),
        inhabitableHouseAxesText: getHouseAxesText(
            getCellHouseInfo(xWing.houseType, xWingLegWithCandidateAsInhabitable.cells[0]),
        ),
    }

    return {
        msg: dynamicInterpolation(XWING.ONE_LEG_NO_CANDIDATE, msgPlaceholdersValues),
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

export const getLegsFilledWithoutErrorResult = xWing => {
    const xWingCells = getXWingCells(xWing.legs)
    const filledXWingCells = filterFilledCellsInTryOut(xWingCells)

    if (filledXWingCells.length === 1) {
        return getOneLegFilledWithoutErrorResult(xWing)
    }
    return getBothLegsFilledWithoutErrorResult(xWing)
}

// change name of this function
// it looks like this function returns some error
const getOneLegFilledWithoutErrorResult = xWing => {
    const filledXWingCells = filterFilledCellsInTryOut(getXWingCells(xWing.legs))
    const filledLegHouse = getCellHouseInfo(xWing.houseType, filledXWingCells[0])
    const houseAxesText = getHouseAxesText(filledLegHouse)

    const msgPlaceholdersValues = {
        candidate: getXWingCandidate(xWing),
        houseAxesText,
        houseFullName: getXWingHouseFullName(xWing),
    }
    return {
        msg: dynamicInterpolation(XWING.ONE_LEG_VALID_FILL, msgPlaceholdersValues),
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

const getBothLegsFilledWithoutErrorResult = xWing => {
    const msgPlaceholdersValues = {
        candidate: getXWingCandidate(xWing),
        houseFullName: getXWingHouseFullNamePlural(xWing),
        ...getXWingHousesTexts(xWing.houseType, xWing.legs),
    }

    return {
        msg: dynamicInterpolation(XWING.BOTH_LEG_VALID_FILL, msgPlaceholdersValues),
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}
