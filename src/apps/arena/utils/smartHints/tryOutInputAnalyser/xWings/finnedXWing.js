import _isEmpty from '@lodash/isEmpty'

import { getXWingCells } from '../../xWing/utils'

import { TRY_OUT_RESULT_STATES } from '../constants'
import { noInputInTryOut, filterFilledCellsInTryOut } from '../helpers'
import { UNATTAINABLE_TRY_OUT_STATE } from '../stringLiterals'

import {
    getNoInputResult,
    getOneLegWithNoCandidateResult,
    getLegsFilledWithoutErrorResult,
    getSameCrossHouseCandidatePossibilitiesResult,
} from './helpers'

export const finnedXWingTryOutAnalyser = ({ xWing, removableNotesHostCells }, boardInputs) => {
    const xWingCells = getXWingCells(xWing.legs)

    if (noInputInTryOut([...xWingCells, ...removableNotesHostCells], boardInputs)) {
        return getNoInputResult(xWing)
    }

    if (!_isEmpty(filterFilledCellsInTryOut(removableNotesHostCells, boardInputs))) {
        return getRemovableNoteHostCellFilledResult(xWing, removableNotesHostCells, boardInputs)
    }

    if (!_isEmpty(filterFilledCellsInTryOut(xWingCells, boardInputs))) {
        return getLegsFilledWithoutErrorResult(xWing, boardInputs)
    }

    // TODO: i should know about this state through some backend api setup
    // it's a bug if execution reaches here
    return {
        msg: UNATTAINABLE_TRY_OUT_STATE,
        state: TRY_OUT_RESULT_STATES.START,
    }
}

const getRemovableNoteHostCellFilledResult = (xWing, removableNotesHostCells, boardInputs) => {
    const noCandidateInALegError = getOneLegWithNoCandidateResult(xWing, removableNotesHostCells, boardInputs)
    if (noCandidateInALegError) return noCandidateInALegError

    return getSameCrossHouseCandidatePossibilitiesResult(xWing)
}
