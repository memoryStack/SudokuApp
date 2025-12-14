import { noInputInTryOut, getCorrectFilledTryOutCandidates } from '../helpers'

import {
    getNakedGroupNoTryOutInputResult,
    getNakedGroupTryOutInputErrorResult,
    getAllInputsFilledResult,
    getPartialCorrectlyFilledResult,
} from './helpers'

export const nakedDoubleTryOutAnalyser = ({ groupCandidates, focusedCells, groupCells }, boardInputs, smartHintsTranslationsTexts) => {
    if (noInputInTryOut(focusedCells, boardInputs)) {
        return getNakedGroupNoTryOutInputResult(groupCandidates, smartHintsTranslationsTexts)
    }

    const tryOutErrorResult = getNakedGroupTryOutInputErrorResult(groupCandidates, groupCells, focusedCells, boardInputs, smartHintsTranslationsTexts)
    if (tryOutErrorResult) {
        return tryOutErrorResult
    }

    const { tryOutMainNumbers } = boardInputs
    const correctlyFilledGroupCandidates = getCorrectFilledTryOutCandidates(groupCells, tryOutMainNumbers)
    if (correctlyFilledGroupCandidates.length === groupCandidates.length) {
        return getAllInputsFilledResult(groupCandidates, groupCells, tryOutMainNumbers, smartHintsTranslationsTexts)
    }
    return getPartialCorrectlyFilledResult(groupCandidates, groupCells, tryOutMainNumbers, smartHintsTranslationsTexts)
}
