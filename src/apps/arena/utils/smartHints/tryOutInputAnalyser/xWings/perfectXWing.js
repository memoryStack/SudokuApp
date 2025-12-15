import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _isEmpty from '@lodash/isEmpty'

import { getXWingHousesTexts } from '../../rawHintTransformers/xWing/transformers/helpers'
import { getHouseWithNumAndNameText, getAxisValuesFromTranslations, getLanguageSpecificHouseTypeText } from '../../util'
import { getCellHouseForHouseType } from '@domain/board/utils/housesAndCells'

import { getXWingCandidate } from '../../xWing/utils'

import { TRY_OUT_RESULT_STATES } from '../constants'
import { noInputInTryOut, filterFilledCellsInTryOut } from '../helpers'

import {
    getNoInputResult,
    getSameCrossHouseCandidatePossibilitiesResult,
    getOneLegWithNoCandidateResult,
    getLegsFilledWithoutErrorResult,
} from './helpers'
import { XWING_TYPES } from '../../xWing/constants'
import { getCellsAxesValuesListText } from '../../rawHintTransformers/helpers'

export const perfectXWingTryOutAnalyser = ({ xWing, xWingCells, removableNotesHostCells }, boardInputs, smartHintsTranslationsTexts) => {
    if (noInputInTryOut([...xWingCells, ...removableNotesHostCells], boardInputs)) {
        return getNoInputResult(xWing, smartHintsTranslationsTexts)
    }

    if (!_isEmpty(filterFilledCellsInTryOut(removableNotesHostCells, boardInputs))) {
        return getRemovableNoteHostCellFilledResult(xWing, removableNotesHostCells, boardInputs, smartHintsTranslationsTexts)
    }

    return getLegsFilledWithoutErrorResult(xWing, boardInputs, smartHintsTranslationsTexts)
}

const getRemovableNoteHostCellFilledResult = (xWing, removableNotesHostCells, boardInputs, smartHintsTranslationsTexts) => {
    const removableNotesHostCellsFilled = filterFilledCellsInTryOut(removableNotesHostCells, boardInputs)
    if (removableNotesHostCellsFilled.length === 2) {
        return getBothHouseWithoutCandidateErrorResult(xWing, removableNotesHostCellsFilled, smartHintsTranslationsTexts)
    }

    const noCandidateInALegError = getOneLegWithNoCandidateResult(xWing, removableNotesHostCells, boardInputs, smartHintsTranslationsTexts)
    if (noCandidateInALegError) return noCandidateInALegError

    return getSameCrossHouseCandidatePossibilitiesResult(xWing, smartHintsTranslationsTexts)
}

const getBothHouseWithoutCandidateErrorResult = (xWing, removableNotesHostCellsFilled, smartHintsTranslationsTexts) => {
    const config = smartHintsTranslationsTexts.tryOutAnalyser.xWing.config
    const houseNumConfig = config.houseAAxesValue
    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)
    const msgPlaceholderValues = {
        ...getXWingHousesTexts(xWing.houseType, xWing.legs, houseNumConfig, smartHintsTranslationsTexts),
        candidate: getXWingCandidate(xWing),
        houseFullName: getLanguageSpecificHouseTypeText(
            getCellHouseForHouseType(xWing.houseType, xWing.legs[0].cells[0]).type,
            config.houseFullName.houseName,
            smartHintsTranslationsTexts
        ),
        filledRemovableNotesHostCells: getCellsAxesValuesListText(removableNotesHostCellsFilled, smartHintsTranslationsTexts.common.conjugations.and, axisValues),
    }
    return {
        msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.xWing.perfect.bothLegsWithoutCandidate, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}
