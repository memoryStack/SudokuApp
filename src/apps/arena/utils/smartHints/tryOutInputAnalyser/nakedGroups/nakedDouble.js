import { getTryOutMainNumbers } from '../../../../store/selectors/smartHintHC.selectors'
import { getStoreState } from '../../../../../../redux/dispatch.helpers'
import { TRY_OUT_RESULT_STATES } from '../constants'
import {
    noInputInTryOut,
    getNakedGroupNoTryOutInputResult,
    getCorrectFilledTryOutCandidates,
    getNakedGroupTryOutInputErrorResult,
    getCandidatesToBeFilled,
} from '../helpers'
import { getCandidatesListText } from '../../util'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'

export const nakedDoubleTryOutAnalyser = ({ groupCandidates, focusedCells, groupCells }) => {
    if (noInputInTryOut(focusedCells)) {
        return getNakedGroupNoTryOutInputResult(groupCandidates)
    }

    const tryOutErrorResult = getNakedGroupTryOutInputErrorResult(groupCandidates, focusedCells)
    if (tryOutErrorResult) {
        return tryOutErrorResult
    }

    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const correctlyFilledGroupCandidates = getCorrectFilledTryOutCandidates(groupCells, tryOutMainNumbers)
    if (correctlyFilledGroupCandidates.length === groupCandidates.length) {
        return getAllInputsFilledResult(groupCandidates)
    } else {
        const candidatesToBeFilled = getCandidatesToBeFilled(correctlyFilledGroupCandidates, groupCandidates)
        return getPartialCorrectlyFilledResult(candidatesToBeFilled)
    }
}

const getAllInputsFilledResult = groupCandidates => {
    const candidatesList = getCandidatesListText(groupCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND)
    return {
        msg:
            `${candidatesList} are filled in` +
            ` these cells without any error. now we are sure` +
            ` that ${candidatesList}` +
            ` can't come in cells where these were highlighted in red`,
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

const getPartialCorrectlyFilledResult = candidatesToBeFilled => {
    const candidatesList = getCandidatesListText(candidatesToBeFilled, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND)
    return {
        msg: `fill ${candidatesList} as well to find where these numbers can't come in the highlighted region.`,
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}


