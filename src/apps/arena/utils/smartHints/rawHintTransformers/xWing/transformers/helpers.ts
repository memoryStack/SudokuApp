import _map from '@lodash/map'

import { isColHouse, getCellHouseForHouseType } from '@domain/board/utils/housesAndCells'

import { BOARD_MOVES_TYPES } from '../../../../../constants'

import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, HOUSE_TYPE_VS_FULL_NAMES } from '../../../constants'
import { getCrossHouseType } from '../../../xWing/utils'
import { getCellsAxesValuesListText, getHouseNumText } from '../../helpers'
import { XWingLegs, XWingRawHint } from '../../../xWing/types'
import { NotesRemovalHintAction, SmartHintsTranslationsTexts } from '../../../types'
import { getAxisValuesFromTranslations, getLanguageSpecificHouseNumText, HouseNumTextTranslationConfig } from '../../../util'

export const getXWingHouseFullName = (xWing: XWingRawHint) => HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME

export const getXWingHouseFullNamePlural = (xWing: XWingRawHint) => HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME_PLURAL

export const getXWingCrossHouseFullName = (xWing: XWingRawHint) => HOUSE_TYPE_VS_FULL_NAMES[getCrossHouseType(xWing.houseType)].FULL_NAME

export const getXWingCrossHouseFullNamePlural = (xWing: XWingRawHint) => HOUSE_TYPE_VS_FULL_NAMES[getCrossHouseType(xWing.houseType)].FULL_NAME_PLURAL

export const getXWingHousesTexts = (
    houseType: HouseType,
    xWingLegs: XWingLegs,
    translationsConfig?: HouseNumTextTranslationConfig,
    translations?: SmartHintsTranslationsTexts,
) => {
    const { houseANum, houseBNum } = getXWingHousesNums(houseType, xWingLegs)
    if (translationsConfig) {
        return {
            houseAAxesValue: getLanguageSpecificHouseNumText(
                { type: houseType, num: houseANum },
                translationsConfig,
                translations as SmartHintsTranslationsTexts
            ),
            houseBAxesValue: getLanguageSpecificHouseNumText(
                { type: houseType, num: houseBNum },
                translationsConfig,
                translations as SmartHintsTranslationsTexts
            )
        }
    }
    return {
        houseAAxesValue: getHouseNumText({ type: houseType, num: houseANum }),
        houseBAxesValue: getHouseNumText({ type: houseType, num: houseBNum }),
    }
}

const getXWingHousesNums = (houseType: HouseType, xWingLegs: XWingLegs) => ({
    houseANum: getCellHouseForHouseType(houseType, xWingLegs[0].cells[0]).num,
    houseBNum: getCellHouseForHouseType(houseType, xWingLegs[1].cells[0]).num,
})

export const getCrossHouseAxesText = (
    xWing: XWingRawHint,
    translationsConfig?: HouseNumTextTranslationConfig,
    translations?: SmartHintsTranslationsTexts,
) => {
    const crossHouseType = getCrossHouseType(xWing.houseType)
    const { crossHouseANum, crossHouseBNum } = getCrossHousesNums(xWing)
    if (translationsConfig) {
        return {
            crossHouseAAxesValue: getLanguageSpecificHouseNumText(
                { type: crossHouseType, num: crossHouseANum },
                translationsConfig,
                translations as SmartHintsTranslationsTexts
            ),
            crossHouseBAxesValue: getLanguageSpecificHouseNumText(
                { type: crossHouseType, num: crossHouseBNum },
                translationsConfig,
                translations as SmartHintsTranslationsTexts
            ),
        }
    }
    return {
        crossHouseAAxesValue: getHouseNumText({ type: crossHouseType, num: crossHouseANum }),
        crossHouseBAxesValue: getHouseNumText({ type: crossHouseType, num: crossHouseBNum }),
    }
}

const getCrossHousesNums = (xWing: XWingRawHint) => {
    const crossHouseType = getCrossHouseType(xWing.houseType)
    return {
        crossHouseANum: getCellHouseForHouseType(crossHouseType, xWing.legs[0].cells[0]).num,
        crossHouseBNum: getCellHouseForHouseType(crossHouseType, xWing.legs[0].cells[1]).num,
    }
}

export const getDiagonalsCornersAxesTexts = (
    xWing: XWingRawHint,
    translations?: SmartHintsTranslationsTexts,
) => {
    const {
        topLeft, topRight, bottomLeft, bottomRight,
    } = getXWingCornerCells(xWing)
    const axisValues = getAxisValuesFromTranslations(translations as SmartHintsTranslationsTexts)
    return {
        topDown: getCellsAxesValuesListText([topLeft, bottomRight], translations?.common.conjugations.and, axisValues),
        bottomUp: getCellsAxesValuesListText([bottomLeft, topRight], translations?.common.conjugations.and, axisValues),
    }
}

export const getXWingCornerCells = (xWing: XWingRawHint) => {
    const { houseType } = xWing
    const xWingLegs = xWing.legs
    return {
        topLeft: xWingLegs[0].cells[0],
        topRight: isColHouse(houseType) ? xWingLegs[1].cells[0] : xWingLegs[0].cells[1],
        bottomLeft: isColHouse(houseType) ? xWingLegs[0].cells[1] : xWingLegs[1].cells[0],
        bottomRight: xWingLegs[1].cells[1],
    }
}

export const getApplyHintData = (
    candidate: NoteValue,
    removableNotesHostCells: Cell[],
): NotesRemovalHintAction[] => _map(removableNotesHostCells, (cell: Cell) => ({
    cell,
    action: { type: BOARD_MOVES_TYPES.REMOVE, notes: [candidate] },
}))
