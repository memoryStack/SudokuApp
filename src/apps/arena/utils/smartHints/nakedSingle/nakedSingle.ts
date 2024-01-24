import { NotesRecord } from '../../../RecordUtilities/boardNotes'

// TODO: put it in utils and refactore it with unit test cases
export const isNakedSinglePresent = (notes: Notes, cell: Cell): { present: boolean, mainNumber: MainNumberValue } => {
    const cellVisibleNotesList = NotesRecord.getCellVisibleNotesList(notes, cell)
    return {
        present: cellVisibleNotesList.length === 1,
        mainNumber: cellVisibleNotesList.length === 1 ? cellVisibleNotesList[0] : -1,
    }
}
