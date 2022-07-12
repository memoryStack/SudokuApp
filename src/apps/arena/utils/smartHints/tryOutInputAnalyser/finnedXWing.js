import { isCellEmpty, isCellNoteVisible, getCellHouseInfo } from '../../util'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, HOUSE_TYPE_VS_FULL_NAMES } from '../constants'
import { TRY_OUT_RESULT_STATES } from './constants'
import { noInputInTryOut, getCellsAxesValuesListText } from './helpers'
import _flatten from '../../../../../utils/utilities/flatten'
import { getTryOutMainNumbers, getTryOutNotes } from '../../../store/selectors/smartHintHC.selectors'
import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { getCrossHouseType, getXWingHousesTexts, getHouseAxesText, getXWingCandidate, getCellsFromXWingLegs, getNoInputResult, filterFilledCells, getSameCrossHouseCandidatePossibilitiesResult, getOneLegWithNoCandidateResult } from '../xWing/utils'
import _isEmpty from '../../../../../utils/utilities/isEmpty'

export default ({ xWing, removableNotesHostCells }) => {
    const xWingCells = getCellsFromXWingLegs(xWing.legs)

    if (noInputInTryOut([...xWingCells, ...removableNotesHostCells])) {
        return getNoInputResult(xWing)
    }

    if (!_isEmpty(filterFilledCells(removableNotesHostCells)) && _isEmpty(filterFilledCells(xWingCells))) {
        return getSameCrossHouseCandidatePossibilitiesResult(xWing)
    }

    if (!_isEmpty(filterFilledCells(removableNotesHostCells)) && !_isEmpty(filterFilledCells(xWingCells))) {
        return getOneLegWithNoCandidateResult(xWing)
    }

    return {
        msg: 'implementation is yet to be done',
        state: TRY_OUT_RESULT_STATES.START,
    }
}
