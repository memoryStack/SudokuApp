import { TRY_OUT_RESULT_STATES } from './constants'
import { noInputInTryOut } from './helpers'
import _flatten from '../../../../../utils/utilities/flatten'
import {
    getXWingCells,
    getNoInputResult,
    filterFilledCells,
    getSameCrossHouseCandidatePossibilitiesResult,
    getOneLegWithNoCandidateResult,
    getLegsFilledWithoutErrorResult,
} from '../xWing/utils'
import _isEmpty from '../../../../../utils/utilities/isEmpty'

export default ({ xWing, removableNotesHostCells }) => {
    const xWingCells = getXWingCells(xWing.legs)

    if (noInputInTryOut([...xWingCells, ...removableNotesHostCells])) {
        return getNoInputResult(xWing)
    }

    if (!_isEmpty(filterFilledCells(removableNotesHostCells)) && _isEmpty(filterFilledCells(xWingCells))) {
        return getSameCrossHouseCandidatePossibilitiesResult(xWing)
    }

    if (!_isEmpty(filterFilledCells(removableNotesHostCells)) && !_isEmpty(filterFilledCells(xWingCells))) {
        return getOneLegWithNoCandidateResult(xWing)
    }

    if (!_isEmpty(filterFilledCells(xWingCells))) {
        return getLegsFilledWithoutErrorResult(xWing)
    }

    // TODO: i should know about this state through some backend api setup
    // it's a bug if execution reaches here
    return {
        msg: 'not sure how we reached here',
        state: TRY_OUT_RESULT_STATES.START,
    }
}
