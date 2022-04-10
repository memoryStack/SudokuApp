import { getStoreState } from "../../../../../redux/dispatch.helpers";
import { getNotesInfo, getPossibleNotes } from "../../../store/selectors/board.selectors";
import { HINTS_IDS } from "../constants";
import { isValidNakedSingle } from "./nakedSingle";

const HINT_TYPE_VS_VALIDITY_CHECKER = {
    [HINTS_IDS.NAKED_SINGLE]: isValidNakedSingle,
}

export const isHintValid = ({ type, data }) => {
    if (!data || !type) return
    
    const validityChecker = HINT_TYPE_VS_VALIDITY_CHECKER[type]
    if (!validityChecker) return true // default is true

    const possibleNotes = getPossibleNotes(getStoreState())
    const userNotesInput = getNotesInfo(getStoreState())
    return validityChecker(data.cell, userNotesInput, possibleNotes)
}
