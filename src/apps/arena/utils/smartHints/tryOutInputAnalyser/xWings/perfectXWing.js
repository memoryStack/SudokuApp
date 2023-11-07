import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _isEmpty from '@lodash/isEmpty'

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
import { getCellsAxesValuesListText } from '../../rawHintTransformers/helpers'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'

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
    const removableNotesHostCellsFilled = filterFilledCellsInTryOut(removableNotesHostCells)
    if (removableNotesHostCellsFilled.length === 2) {
        return getBothHouseWithoutCandidateErrorResult(xWing, removableNotesHostCellsFilled)
    }

    const noCandidateInALegError = getOneLegWithNoCandidateResult(xWing, removableNotesHostCells)
    if (noCandidateInALegError) return noCandidateInALegError

    return getSameCrossHouseCandidatePossibilitiesResult(xWing)
}

const getBothHouseWithoutCandidateErrorResult = (xWing, removableNotesHostCellsFilled) => {
    const msgPlaceholderValues = {
        ...getXWingHousesTexts(xWing.houseType, xWing.legs),
        candidate: getXWingCandidate(xWing),
        houseFullName: getXWingHouseFullName(xWing),
        filledRemovableNotesHostCells: getCellsAxesValuesListText(removableNotesHostCellsFilled, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
    }
    return {
        msg: dynamicInterpolation(XWING[XWING_TYPES.PERFECT].BOTH_LEGS_WITHOUT_CANDIDATE, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}
