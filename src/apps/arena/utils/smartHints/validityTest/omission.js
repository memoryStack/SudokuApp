import { areSameCellsSets, isCellNoteVisible } from '../../util'

export const isValidOmission = ({ note, houseCells, userNotesHostCells }, _, possibleNotes) => {
    const notePossibleHostCells = houseCells.filter(cell => {
        return isCellNoteVisible(note, possibleNotes[cell.row][cell.col])
    })
    return areSameCellsSets(userNotesHostCells, notePossibleHostCells)
}
