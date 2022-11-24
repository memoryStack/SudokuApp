import _flatten from 'lodash/src/utils/flatten'
import _isEmpty from 'lodash/src/utils/isEmpty'

import {
    getXWingCells,
    getNoInputResult,
    filterFilledCellsInTryOut,
    getSameCrossHouseCandidatePossibilitiesResult,
    getOneLegWithNoCandidateResult,
    getLegsFilledWithoutErrorResult,
} from '../xWing/utils'

import { TRY_OUT_RESULT_STATES } from './constants'
import { noInputInTryOut } from './helpers'

export default ({ xWing, removableNotesHostCells }) => {
    const xWingCells = getXWingCells(xWing.legs)

    if (noInputInTryOut([...xWingCells, ...removableNotesHostCells])) {
        return getNoInputResult(xWing)
    }

    if (!_isEmpty(filterFilledCellsInTryOut(removableNotesHostCells)) && _isEmpty(filterFilledCellsInTryOut(xWingCells))) {
        return getSameCrossHouseCandidatePossibilitiesResult(xWing)
    }

    if (!_isEmpty(filterFilledCellsInTryOut(removableNotesHostCells)) && !_isEmpty(filterFilledCellsInTryOut(xWingCells))) {
        return getOneLegWithNoCandidateResult(xWing)
    }

    if (!_isEmpty(filterFilledCellsInTryOut(xWingCells))) {
        return getLegsFilledWithoutErrorResult(xWing)
    }

    // TODO: i should know about this state through some backend api setup
    // it's a bug if execution reaches here
    return {
        msg: 'not sure how we reached here',
        state: TRY_OUT_RESULT_STATES.START,
    }
}
