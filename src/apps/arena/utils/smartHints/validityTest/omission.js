import { NotesRecord } from '../../../RecordUtilities/boardNotes'
import { areSameCellsSets } from '../../util'

export const isValidOmission = ({ note, houseCells, userNotesHostCells }, possibleNotes) => {
    const notePossibleHostCells = houseCells.filter(cell => NotesRecord.isNotePresentInCell(possibleNotes, note, cell))
    return areSameCellsSets(userNotesHostCells, notePossibleHostCells)
}
