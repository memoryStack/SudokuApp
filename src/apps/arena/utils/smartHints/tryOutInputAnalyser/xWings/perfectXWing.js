import { dynamicInterpolation } from 'lodash/src/utils/dynamicInterpolation'
import _flatten from 'lodash/src/utils/flatten'
import _isEmpty from 'lodash/src/utils/isEmpty'

import { getXWingHouseFullName, getXWingHousesTexts } from '../../rawHintTransformers/xWing/transformers/helpers'

import { getXWingCandidate } from '../../xWing/utils'

import { TRY_OUT_RESULT_STATES } from '../constants'
import { noInputInTryOut, filterFilledCellsInTryOut } from '../helpers'

import {
    getNoInputResult,
    getSameCrossHouseCandidatePossibilitiesResult,
    getOneLegWithNoCandidateResult,
    getLegsFilledWithoutErrorResult,
} from './helpers'
import { XWING } from '../stringLiterals'
import { XWING_TYPES } from '../../xWing/constants'

export const perfectXWingTryOutAnalyser = ({ xWing, xWingCells, removableNotesHostCells }) => {
    if (noInputInTryOut([...xWingCells, ...removableNotesHostCells])) {
        return getNoInputResult(xWing)
    }

    if (!_isEmpty(filterFilledCellsInTryOut(removableNotesHostCells))) {
        return getRemovableNoteHostCellFilledResult(xWing, removableNotesHostCells)
    }

    return getLegsFilledWithoutErrorResult(xWing)
}

const getRemovableNoteHostCellFilledResult = (xWing, removableNotesHostCells) => {
    const removableNotesHostCellsFilledCount = filterFilledCellsInTryOut(removableNotesHostCells).length
    if (removableNotesHostCellsFilledCount === 2) {
        return getBothHouseWithoutCandidateErrorResult(xWing)
    }

    const noCandidateInALegError = getOneLegWithNoCandidateResult(xWing)
    if (noCandidateInALegError) return noCandidateInALegError

    return getSameCrossHouseCandidatePossibilitiesResult(xWing)
}

const getBothHouseWithoutCandidateErrorResult = xWing => {
    const msgPlaceholderValues = {
        ...getXWingHousesTexts(xWing.houseType, xWing.legs),
        candidate: getXWingCandidate(xWing),
        houseFullName: getXWingHouseFullName(xWing),
    }
    return {
        msg: dynamicInterpolation(XWING[XWING_TYPES.PERFECT].BOTH_LEGS_WITHOUT_CANDIDATE, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}
