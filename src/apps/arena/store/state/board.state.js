import { MainNumbersRecord } from '../../RecordUtilities/boardMainNumbers'
import { initNotes } from '../../utils/util'

export const INITIAL_STATE = {
    mainNumbers: MainNumbersRecord.initMainNumbers(),
    selectedCell: { row: 0, col: 0 },
    notes: initNotes(),
    possibleNotes: initNotes(),
    moves: [],
}
