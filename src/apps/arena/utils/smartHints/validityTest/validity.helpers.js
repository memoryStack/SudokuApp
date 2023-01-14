import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { NUMBERS_IN_HOUSE } from '../../../constants'
import { getPossibleNotes } from '../../../store/selectors/board.selectors'
import { isCellNoteVisible } from '../../util'

// TODO: remove this use of global state like this, let's flow all the data from UI layer
// to all the utils
export const cellHasAllPossibleNotes = (cell, userInputNotes) => {
    const possibleNotes = getPossibleNotes(getStoreState())
    const cellPossibleNotes = possibleNotes[cell.row][cell.col]

    for (let note = 1; note <= NUMBERS_IN_HOUSE; note++) {
        const sameVisibilityStatus =
            isCellNoteVisible(note, userInputNotes) === isCellNoteVisible(note, cellPossibleNotes)
        if (!sameVisibilityStatus) return false
    }

    return true
}
