import { NotesRecord } from '../../../RecordUtilities/boardNotes'

export const isValidNakedSingle = ({ cell }, possibleNotes) => NotesRecord.getCellVisibleNotesCount(possibleNotes, cell) === 1
