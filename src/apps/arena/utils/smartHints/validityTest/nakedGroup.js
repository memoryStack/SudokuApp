import { NotesRecord } from '../../../RecordUtilities/boardNotes'

export const isValidNakedGroup = ({ groupCandidates, hostCells }, possibleNotes) => {
    const extraCandidatePossible = hostCells.some(cell => NotesRecord.getCellNotes(possibleNotes, cell)
        .some(({ show, noteValue }) => show && !groupCandidates.includes(noteValue)))
    return !extraCandidatePossible
}
