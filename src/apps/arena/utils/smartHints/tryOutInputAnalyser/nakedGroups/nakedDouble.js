import { getTryOutMainNumbers } from '../../../../store/selectors/smartHintHC.selectors'
import { getStoreState } from '../../../../../../redux/dispatch.helpers'

import { noInputInTryOut, getCorrectFilledTryOutCandidates, getCandidatesToBeFilled } from '../helpers'

import {
    getNakedGroupNoTryOutInputResult,
    getNakedGroupTryOutInputErrorResult,
    getAllInputsFilledResult,
    getPartialCorrectlyFilledResult,
} from './helpers'

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
    }
    const candidatesToBeFilled = getCandidatesToBeFilled(correctlyFilledGroupCandidates, groupCandidates)
    return getPartialCorrectlyFilledResult(candidatesToBeFilled)
}
