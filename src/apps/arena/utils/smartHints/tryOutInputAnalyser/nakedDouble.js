import { getTryOutMainNumbers } from '../../../store/selectors/smartHintHC.selectors'
import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { TRY_OUT_RESULT_STATES } from './constants'
import { noInputInTryOut, getTryOutErrorType, getNakedGroupNoTryOutInputResult, getTryOutErrorResult, getCorrectFilledTryOutCandidates, getCandidatesToBeFilled } from './helpers'
import { getCandidatesListText } from '../util'
import { HINT_TEXT_CANDIDATES_JOIN_CONJUGATION } from '../constants'

const tryOutAnalyser = ({ groupCandidates, focusedCells, groupCells }) => {

    if (noInputInTryOut(focusedCells)) {
        return getNakedGroupNoTryOutInputResult(groupCandidates)
    }

    const tryOutErrorType = getTryOutErrorType(groupCandidates, focusedCells)
    if (tryOutErrorType) {
        return getTryOutErrorResult(tryOutErrorType)
    }

    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const correctlyFilledGroupCandidates = getCorrectFilledTryOutCandidates(groupCells, tryOutMainNumbers)
    if (correctlyFilledGroupCandidates.length === groupCandidates.length) {
        const candidatesList = getCandidatesListText(correctlyFilledGroupCandidates, HINT_TEXT_CANDIDATES_JOIN_CONJUGATION.AND)
        return {
            msg:
                `${candidatesList} are filled in` +
                ` these cells without any error. now we are sure` +
                ` that ${candidatesList}` +
                ` can't come in cells where these were highlighted in red`,
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    } else {
        const candidatesToBeFilled = getCandidatesToBeFilled(correctlyFilledGroupCandidates, groupCandidates)
        const candidatesList = getCandidatesListText(candidatesToBeFilled, HINT_TEXT_CANDIDATES_JOIN_CONJUGATION.AND)
        return {
            msg:
                `fill ${candidatesList} as well to find where`
                + ` these numbers can't come in the highlighted region.`,
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    }
}

export default tryOutAnalyser
