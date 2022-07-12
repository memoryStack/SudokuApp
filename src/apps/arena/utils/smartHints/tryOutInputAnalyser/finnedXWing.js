import { isCellEmpty, isCellNoteVisible, getCellHouseInfo } from '../../util'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, HOUSE_TYPE_VS_FULL_NAMES } from '../constants'
import { TRY_OUT_RESULT_STATES } from './constants'
import { noInputInTryOut, getCellsAxesValuesListText } from './helpers'
import _flatten from '../../../../../utils/utilities/flatten'
import { getTryOutMainNumbers, getTryOutNotes } from '../../../store/selectors/smartHintHC.selectors'
import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { getCrossHouseType, getXWingHousesTexts, getHouseAxesText, getXWingCandidate, getCellsFromXWingLegs, getNoInputResult, filterFilledCells, getSameCrossHouseCandidatePossibilitiesResult } from '../xWing/utils'

export default ({ xWing, removableNotesHostCells }) => {
    const xWingCells = getCellsFromXWingLegs(xWing.legs)

    if (noInputInTryOut([...xWingCells, ...removableNotesHostCells])) {
        return getNoInputResult(xWing)
    }

    if (filterFilledCells(removableNotesHostCells).length) {
        return getSameCrossHouseCandidatePossibilitiesResult(xWing)
    }

    return {
        msg: 'implementation is yet to be done',
        state: TRY_OUT_RESULT_STATES.START,
    }
}
