import { MainNumbersRecord } from '../../RecordUtilities/boardMainNumbers'
import { NotesRecord } from '../../RecordUtilities/boardNotes'

export const INITIAL_STATE = {
    mainNumbers: MainNumbersRecord.initMainNumbers(),
    selectedCell: { row: 0, col: 0 },
    notes: NotesRecord.initNotes(),
    possibleNotes: NotesRecord.initNotes(),
    moves: [],
}
