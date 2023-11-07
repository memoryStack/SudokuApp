import _isEmpty from '@lodash/isEmpty'
import { dynamicInterpolation } from '@lodash/dynamicInterpolation'

import { getStoreState } from '../../../../../../redux/dispatch.helpers'

import { NotesRecord } from '../../../../RecordUtilities/boardNotes'
import { MainNumbersRecord } from '../../../../RecordUtilities/boardMainNumbers'
import { getMainNumbers } from '../../../../store/selectors/board.selectors'
import { getTryOutMainNumbers, getTryOutNotes } from '../../../../store/selectors/smartHintHC.selectors'

import { getCellHouseForHouseType } from '../../../util'

import { getCellsAxesValuesListText, getHouseNumText } from '../../rawHintTransformers/helpers'
import {
    getXWingHouseFullName,
    getXWingHouseFullNamePlural,
    getXWingHousesTexts,
} from '../../rawHintTransformers/xWing/transformers/helpers'

import { getXWingCandidate, getXWingCells } from '../../xWing/utils'

import { TRY_OUT_RESULT_STATES } from '../constants'
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
    const msgPlaceholdersValues = {
        candidate: getXWingCandidate(xWing),
        ...getXWingHousesTexts(xWing.houseType, xWing.legs),
        houseFullNamePlural: getXWingHouseFullNamePlural(xWing),
    }
    return {
        msg: dynamicInterpolation(XWING.SAME_CROSSHOUSE, msgPlaceholdersValues),
        state: TRY_OUT_RESULT_STATES.START,
    }
}

export const getOneLegWithNoCandidateResult = (xWing, removableNotesHostCells) => {
    const candidate = getXWingCandidate(xWing)
    const xWingLegWithCandidateAsInhabitable = getCandidateInhabitableLeg(candidate, xWing.legs)
    if (_isEmpty(xWingLegWithCandidateAsInhabitable)) return null

    const msgPlaceholdersValues = {
        candidate,
        houseFullName: getXWingHouseFullName(xWing),
        inhabitableHouseAxesText: getHouseNumText(getCellHouseForHouseType(xWing.houseType, xWingLegWithCandidateAsInhabitable.cells[0])),
        filledRemovableNotesHostCells: getCellsAxesValuesListText(filterFilledCellsInTryOut(removableNotesHostCells)),
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
    // handles sashimi finned x-wing as well
    return xWingLegs.find(({ cells: legXWingCells }) => legXWingCells.every(xWingCell => (
        (!MainNumbersRecord.isCellFilled(tryOutMainNumbers, xWingCell) || MainNumbersRecord.isCellFilled(mainNumbers, xWingCell))
        && !NotesRecord.isNotePresentInCell(notes, candidate, xWingCell)
    )))
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
    const filledLegHouse = getCellHouseForHouseType(xWing.houseType, filledXWingCells[0])
    const houseAxesText = getHouseNumText(filledLegHouse)

    const msgPlaceholdersValues = {
        candidate: getXWingCandidate(xWing),
        houseAxesText,
        houseFullName: getXWingHouseFullName(xWing),
        filledXWingCornerCell: getCellsAxesValuesListText(filledXWingCells),
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
