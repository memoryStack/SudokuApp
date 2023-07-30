import { NotesRecord } from '../../../RecordUtilities/boardNotes'
import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { NUMBERS_IN_HOUSE } from '../../../constants'
import { getPossibleNotes } from '../../../store/selectors/board.selectors'

// TODO: remove this use of global state like this, let's flow all the data from UI layer
// to all the utils
export const cellHasAllPossibleNotes = (cell, userInputNotes) => {
    const possibleNotes = getPossibleNotes(getStoreState())

    for (let note = 1; note <= NUMBERS_IN_HOUSE; note++) {
        const sameVisibilityStatus = NotesRecord.isNotePresentInCell(userInputNotes, note, cell) === NotesRecord.isNotePresentInCell(possibleNotes, note, cell)
        if (!sameVisibilityStatus) return false
    }

    return true
}
