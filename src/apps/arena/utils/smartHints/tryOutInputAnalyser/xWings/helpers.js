import _isEmpty from '@lodash/isEmpty'
import { dynamicInterpolation } from '@lodash/dynamicInterpolation'

import { NotesRecord } from '@domain/board/records/notesRecord'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'

import { getCellHouseForHouseType } from '@domain/board/utils/housesAndCells'

import { getCellsAxesValuesListText } from '../../rawHintTransformers/helpers'
import {
    getXWingHousesTexts,
} from '../../rawHintTransformers/xWing/transformers/helpers'
import { getLanguageSpecificHouseNumText, getHouseWithNumAndNameText, getAxisValuesFromTranslations, getLanguageSpecificHouseTypeText } from '../../util'

import { getXWingCandidate, getXWingCells } from '../../xWing/utils'

import { TRY_OUT_RESULT_STATES } from '../constants'
import { filterFilledCellsInTryOut } from '../helpers'

export const getNoInputResult = (xWing, smartHintsTranslationsTexts) => {
    const config = smartHintsTranslationsTexts.tryOutAnalyser.xWing.config
    const houseNumConfig = config.houseAAxesValue
    const houseFullNameConfig = config.houseFullNamePlural
    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)

    const msgPlaceholdersValues = {
        candidate: getXWingCandidate(xWing),
        ...getXWingHousesTexts(xWing.houseType, xWing.legs, houseNumConfig, smartHintsTranslationsTexts),
        houseFullName: getHouseWithNumAndNameText(
            getCellHouseForHouseType(xWing.houseType, xWing.legs[0].cells[0]),
            houseFullNameConfig,
            smartHintsTranslationsTexts
        ),
    }
    return {
        msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.xWing.noInput, msgPlaceholdersValues),
        state: TRY_OUT_RESULT_STATES.START,
    }
}

export const getSameCrossHouseCandidatePossibilitiesResult = (xWing, smartHintsTranslationsTexts) => {
    const config = smartHintsTranslationsTexts.tryOutAnalyser.xWing.config
    const houseNumConfig = config.houseAAxesValue
    const houseFullNameConfig = config.houseFullNamePlural

    const msgPlaceholdersValues = {
        candidate: getXWingCandidate(xWing),
        ...getXWingHousesTexts(xWing.houseType, xWing.legs, houseNumConfig, smartHintsTranslationsTexts),
        houseFullNamePlural: getHouseWithNumAndNameText(
            getCellHouseForHouseType(xWing.houseType, xWing.legs[0].cells[0]),
            houseFullNameConfig,
            smartHintsTranslationsTexts
        ),
    }
    return {
        msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.xWing.sameCrosshouse, msgPlaceholdersValues),
        state: TRY_OUT_RESULT_STATES.START,
    }
}

export const getOneLegWithNoCandidateResult = (xWing, removableNotesHostCells, boardInputs, smartHintsTranslationsTexts) => {
    const candidate = getXWingCandidate(xWing)
    const xWingLegWithCandidateAsInhabitable = getCandidateInhabitableLeg(candidate, xWing.legs, boardInputs)
    if (_isEmpty(xWingLegWithCandidateAsInhabitable)) return null

    const config = smartHintsTranslationsTexts.tryOutAnalyser.xWing.config
    const inhabitableHouse = getCellHouseForHouseType(xWing.houseType, xWingLegWithCandidateAsInhabitable.cells[0])
    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)

    const msgPlaceholdersValues = {
        candidate,
        houseFullName: getHouseWithNumAndNameText(
            inhabitableHouse,
            config.houseFullName,
            smartHintsTranslationsTexts
        ),
        inhabitableHouseAxesText: getLanguageSpecificHouseNumText(inhabitableHouse, config.inhabitableHouseAxesText, smartHintsTranslationsTexts),
        filledRemovableNotesHostCells: getCellsAxesValuesListText(filterFilledCellsInTryOut(removableNotesHostCells, boardInputs), undefined, axisValues),
    }

    return {
        msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.xWing.oneLegNoCandidate, msgPlaceholdersValues),
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const getCandidateInhabitableLeg = (candidate, xWingLegs, boardInputs) => {
    const { tryOutMainNumbers, tryOutNotes, actualMainNumbers } = boardInputs
    // handles sashimi finned x-wing as well
    return xWingLegs.find(({ cells: legXWingCells }) => legXWingCells.every(xWingCell => (
        (!MainNumbersRecord.isCellFilled(tryOutMainNumbers, xWingCell) || MainNumbersRecord.isCellFilled(actualMainNumbers, xWingCell))
        && !NotesRecord.isNotePresentInCell(tryOutNotes, candidate, xWingCell)
    )))
}

export const getLegsFilledWithoutErrorResult = (xWing, boardInputs, smartHintsTranslationsTexts) => {
    const xWingCells = getXWingCells(xWing.legs)
    const filledXWingCells = filterFilledCellsInTryOut(xWingCells, boardInputs)

    if (filledXWingCells.length === 1) {
        return getOneLegFilledWithoutErrorResult(xWing, boardInputs, smartHintsTranslationsTexts)
    }
    return getBothLegsFilledWithoutErrorResult(xWing, smartHintsTranslationsTexts)
}

// change name of this function
// it looks like this function returns some error
const getOneLegFilledWithoutErrorResult = (xWing, boardInputs, smartHintsTranslationsTexts) => {
    const filledXWingCells = filterFilledCellsInTryOut(getXWingCells(xWing.legs), boardInputs)
    const filledLegHouse = getCellHouseForHouseType(xWing.houseType, filledXWingCells[0])
    const config = smartHintsTranslationsTexts.tryOutAnalyser.xWing.config
    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)

    const msgPlaceholdersValues = {
        candidate: getXWingCandidate(xWing),
        houseAxesText: getLanguageSpecificHouseNumText(filledLegHouse, config.houseAxesText, smartHintsTranslationsTexts),
        houseFullName: getLanguageSpecificHouseTypeText(
            filledLegHouse.type,
            config.houseFullName,
            smartHintsTranslationsTexts
        ),
        filledXWingCornerCell: getCellsAxesValuesListText(filledXWingCells, undefined, axisValues),
    }
    return {
        msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.xWing.oneLegValidFill, msgPlaceholdersValues),
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

const getBothLegsFilledWithoutErrorResult = (xWing, smartHintsTranslationsTexts) => {
    const config = smartHintsTranslationsTexts.tryOutAnalyser.xWing.config
    const houseNumConfig = config.houseAAxesValue
    const houseFullNameConfig = config.houseFullNamePlural

    const msgPlaceholdersValues = {
        candidate: getXWingCandidate(xWing),
        houseFullName: getHouseWithNumAndNameText(
            getCellHouseForHouseType(xWing.houseType, xWing.legs[0].cells[0]),
            houseFullNameConfig,
            smartHintsTranslationsTexts
        ),
        ...getXWingHousesTexts(xWing.houseType, xWing.legs, houseNumConfig, smartHintsTranslationsTexts),
    }

    return {
        msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.xWing.bothLegValidFill, msgPlaceholdersValues),
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}
