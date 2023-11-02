import { getTryOutMainNumbers } from '../../../../store/selectors/smartHintHC.selectors'
import { getStoreState } from '../../../../../../redux/dispatch.helpers'

import { noInputInTryOut, getCorrectFilledTryOutCandidates } from '../helpers'

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

    const tryOutErrorResult = getNakedGroupTryOutInputErrorResult(groupCandidates, groupCells, focusedCells)
    if (tryOutErrorResult) {
        return tryOutErrorResult
    }

    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const correctlyFilledGroupCandidates = getCorrectFilledTryOutCandidates(groupCells, tryOutMainNumbers)
    if (correctlyFilledGroupCandidates.length === groupCandidates.length) {
        return getAllInputsFilledResult(groupCandidates, groupCells, tryOutMainNumbers)
    }
    return getPartialCorrectlyFilledResult(groupCandidates, groupCells, tryOutMainNumbers)
}
