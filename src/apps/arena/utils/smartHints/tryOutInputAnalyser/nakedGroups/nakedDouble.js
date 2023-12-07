import { noInputInTryOut, getCorrectFilledTryOutCandidates } from '../helpers'

import {
    getNakedGroupNoTryOutInputResult,
    getNakedGroupTryOutInputErrorResult,
    getAllInputsFilledResult,
    getPartialCorrectlyFilledResult,
} from './helpers'

export const nakedDoubleTryOutAnalyser = ({ groupCandidates, focusedCells, groupCells }, boardInputs) => {
    if (noInputInTryOut(focusedCells, boardInputs)) {
        return getNakedGroupNoTryOutInputResult(groupCandidates)
    }

    const tryOutErrorResult = getNakedGroupTryOutInputErrorResult(groupCandidates, groupCells, focusedCells, boardInputs)
    if (tryOutErrorResult) {
        return tryOutErrorResult
    }

    const { tryOutMainNumbers } = boardInputs
    const correctlyFilledGroupCandidates = getCorrectFilledTryOutCandidates(groupCells, tryOutMainNumbers)
    if (correctlyFilledGroupCandidates.length === groupCandidates.length) {
        return getAllInputsFilledResult(groupCandidates, groupCells, tryOutMainNumbers)
    }
    return getPartialCorrectlyFilledResult(groupCandidates, groupCells, tryOutMainNumbers)
}
