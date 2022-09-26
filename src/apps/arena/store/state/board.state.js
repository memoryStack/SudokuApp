import { initNotes, initMainNumbers } from '../../utils/util'

export const INITIAL_STATE = {
    mainNumbers: initMainNumbers(),
    selectedCell: { row: 0, col: 0 },
    notesInfo: initNotes(),
    possibleNotes: initNotes(),
    moves: [],
}
