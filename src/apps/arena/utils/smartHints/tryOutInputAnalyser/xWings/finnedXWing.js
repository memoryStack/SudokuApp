import _isEmpty from '@lodash/isEmpty'

import { getXWingCells } from '../../xWing/utils'

import { TRY_OUT_RESULT_STATES } from '../constants'
import { noInputInTryOut, filterFilledCellsInTryOut } from '../helpers'
import { UNATTAINABLE_TRY_OUT_STATE } from '../stringLiterals'

import {
    getNoInputResult,
    getSameCrossHouseCandidatePossibilitiesResult,
    getOneLegWithNoCandidateResult,
    getLegsFilledWithoutErrorResult,
} from './helpers'

export const finnedXWingTryOutAnalyser = ({ xWing, removableNotesHostCells }) => {
    const xWingCells = getXWingCells(xWing.legs)

    if (noInputInTryOut([...xWingCells, ...removableNotesHostCells])) {
        return getNoInputResult(xWing)
    }

    if (
        !_isEmpty(filterFilledCellsInTryOut(removableNotesHostCells))
        && _isEmpty(filterFilledCellsInTryOut(xWingCells))
    ) {
        return getSameCrossHouseCandidatePossibilitiesResult(xWing)
    }

    if (
        !_isEmpty(filterFilledCellsInTryOut(removableNotesHostCells))
        && !_isEmpty(filterFilledCellsInTryOut(xWingCells))
    ) {
        return getOneLegWithNoCandidateResult(xWing)
    }

    if (!_isEmpty(filterFilledCellsInTryOut(xWingCells))) {
        return getLegsFilledWithoutErrorResult(xWing)
    }

    // TODO: i should know about this state through some backend api setup
    // it's a bug if execution reaches here
    return {
        msg: UNATTAINABLE_TRY_OUT_STATE,
        state: TRY_OUT_RESULT_STATES.START,
    }
}
