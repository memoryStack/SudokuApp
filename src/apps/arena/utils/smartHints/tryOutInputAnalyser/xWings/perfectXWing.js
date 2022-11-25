import _flatten from 'lodash/src/utils/flatten'

import {
    getXWingHousesTexts,
    getXWingCandidate,
    getNoInputResult,
    filterFilledCellsInTryOut,
    getSameCrossHouseCandidatePossibilitiesResult,
    getOneLegWithNoCandidateResult,
    getXWingCells,
    getLegsFilledWithoutErrorResult,
} from '../../xWing/utils'

import { HOUSE_TYPE_VS_FULL_NAMES } from '../../constants'

import { TRY_OUT_RESULT_STATES } from '../constants'
import { noInputInTryOut } from '../helpers'

export const perfectXWingTryOutAnalyser = ({ xWing, xWingCells, removableNotesHostCells }) => {
    if (noInputInTryOut([...xWingCells, ...removableNotesHostCells])) {
        return getNoInputResult(xWing)
    }

    if (filterFilledCellsInTryOut(removableNotesHostCells).length) {
        return getRemovableNoteHostCellFilledResult(xWing, removableNotesHostCells)
    }

    return getLegsFilledWithoutErrorResult(xWing)
}

const getRemovableNoteHostCellFilledResult = (xWing, removableNotesHostCells) => {
    const xWingCells = getXWingCells(xWing.legs)
    const removableNotesHostCellsFilledCount = filterFilledCellsInTryOut(removableNotesHostCells).length
    if (removableNotesHostCellsFilledCount === 2) {
        return getBothHouseWithoutCandidateErrorResult(xWing)
    }

    const xWingFilledCellsCount = filterFilledCellsInTryOut(xWingCells).length
    if (xWingFilledCellsCount) {
        return getOneLegWithNoCandidateResult(xWing)
    }

    return getSameCrossHouseCandidatePossibilitiesResult(xWing)
}

const getBothHouseWithoutCandidateErrorResult = xWing => {
    const { houseAAxesValue, houseBAxesValue } = getXWingHousesTexts(xWing.houseType, xWing.legs)
    const candidate = getXWingCandidate(xWing)
    const houseFullName = HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME_PLURAL
    return {
        msg: `there is no cell in ${houseAAxesValue} and ${houseBAxesValue} ${houseFullName} where ${candidate} can come`,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}
