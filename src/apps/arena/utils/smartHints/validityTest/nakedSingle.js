import { NotesRecord } from 'src/apps/arena/RecordUtilities/boardNotes'

export const isValidNakedSingle = ({ cell }, possibleNotes) => NotesRecord.getCellVisibleNotesCount(possibleNotes, cell) === 1
