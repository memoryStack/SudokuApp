import { isCellEmpty, isCellNoteVisible, getCellHouseInfo } from '../../util'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, HOUSE_TYPE_VS_FULL_NAMES } from '../constants'
import { TRY_OUT_RESULT_STATES } from './constants'
import { noInputInTryOut, getCellsAxesValuesListText } from './helpers'
import _flatten from '../../../../../utils/utilities/flatten'
import { getTryOutMainNumbers, getTryOutNotes } from '../../../store/selectors/smartHintHC.selectors'
import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { getCrossHouseType, getXWingHousesTexts, getHouseAxesText, getXWingCandidate, getNoInputResult, filterFilledCells, getSameCrossHouseCandidatePossibilitiesResult, getXWingHouseFullNamePlural, getXWingHouseFullName, getOneLegWithNoCandidateResult } from '../xWing/utils'

export default ({ xWing, xWingCells, removableNotesHostCells }) => {
    if (noInputInTryOut([...xWingCells, ...removableNotesHostCells])) {
        return getNoInputResult(xWing)
    }

    if (filterFilledCells(removableNotesHostCells).length) {
        return getRemovableNoteHostCellFilledResult(xWing, removableNotesHostCells)
    }

    return getXWingCellsFilledResult(xWing)
}

const getRemovableNoteHostCellFilledResult = (xWing, removableNotesHostCells) => {
    const xWingCells = getXWingCells(xWing.legs)
    const removableNotesHostCellsFilledCount = filterFilledCells(removableNotesHostCells).length
    if (removableNotesHostCellsFilledCount === 2) {
        return getBothHouseWithoutCandidateErrorResult(xWing)
    }

    const xWingFilledCellsCount = filterFilledCells(xWingCells).length
    if (xWingFilledCellsCount) {
        return getOneLegWithNoCandidateResult(xWing)
    }

    return getSameCrossHouseCandidatePossibilitiesResult(xWing)
}

const getXWingCellsFilledResult = xWing => {
    const xWingCells = getXWingCells(xWing.legs)
    const filledXWingCells = filterFilledCells(xWingCells)

    if (filledXWingCells.length === 1) {
        return getOneCornorFilledResult(xWing, filledXWingCells)
    }
    return getBothCornorsFilledResult(xWing)
}

const getOneCornorFilledResult = (xWing, filledXWingCells) => {
    const candidate = getXWingCandidate(xWing)
    const houseFullName = getXWingHouseFullName(xWing)

    const filledLegHouse = getCellHouseInfo(xWing.houseType, filledXWingCells[0])
    const houseAxesText = getHouseAxesText(filledLegHouse)
    return {
        msg:
            `${candidate} is filled in ${houseAxesText} ${houseFullName} without any error, try filling it` +
            ` in other places as well where it is highlighted in red or green color`,
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

const getBothCornorsFilledResult = xWing => {
    const candidate = getXWingCandidate(xWing)
    const houseFullName = getXWingHouseFullNamePlural(xWing)
    const { houseAAxesValue, houseBAxesValue } = getXWingHousesTexts(xWing.houseType, xWing.legs)
    return {
        msg:
            `${candidate} is filled in ${houseAAxesValue} and ${houseBAxesValue} ${houseFullName} without` +
            ` any error, and all the ${candidate} highlighted in red color are removed`,
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

// TODO: re-implemented in utils
// use this approach in other places
const getXWingCells = xWingLegs => {
    return _flatten(xWingLegs.map(leg => leg.cells))
}

const getBothHouseWithoutCandidateErrorResult = xWing => {
    const { houseAAxesValue, houseBAxesValue } = getXWingHousesTexts(xWing.houseType, xWing.legs)
    const candidate = getXWingCandidate(xWing)
    const houseFullName = HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME_PLURAL
    return {
        msg: `there is no cell in ${houseAAxesValue} and ${houseBAxesValue} ${houseFullName} where ${candidate} can come`,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}
