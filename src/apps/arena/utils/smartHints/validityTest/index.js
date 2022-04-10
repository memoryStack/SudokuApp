import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { getNotesInfo, getPossibleNotes } from '../../../store/selectors/board.selectors'
import { GROUPS, HINTS_IDS } from '../constants'
import { isValidHiddenSingle } from './hiddenSingle'
import { isValidNakedSingle } from './nakedSingle'
import { isValidNakedGroup } from './nakedGroup'

const HINT_TYPE_VS_VALIDITY_CHECKER = {
    [HINTS_IDS.NAKED_SINGLE]: isValidNakedSingle,
    [HINTS_IDS.HIDDEN_SINGLE]: isValidHiddenSingle,
    [GROUPS.NAKED_GROUP]: isValidNakedGroup,
}

export const isHintValid = ({ type, data }) => {
    if (!data || !type) return false

    const validityChecker = HINT_TYPE_VS_VALIDITY_CHECKER[type]
    if (!validityChecker) return true // default is true

    const possibleNotes = getPossibleNotes(getStoreState())
    const userNotesInput = getNotesInfo(getStoreState())
    return validityChecker(data, userNotesInput, possibleNotes)
}
