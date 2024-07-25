import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { NotesRecord } from '@domain/board/records/notesRecord'

export const INITIAL_STATE = {
    mainNumbers: MainNumbersRecord.initMainNumbers(),
    selectedCell: { row: 0, col: 0 },
    notes: NotesRecord.initNotes(),
    moves: [],
}
