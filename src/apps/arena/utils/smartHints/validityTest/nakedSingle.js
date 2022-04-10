export const isValidNakedSingle = ({ cell }, userNotesInput, possibleNotes) => {
    const userInputCellNotes = userNotesInput[cell.row][cell.col]
    const possibleCellNotes = possibleNotes[cell.row][cell.col]

    let visibleNotesCount = 0
    for (let note = 1; note <= 9; note++) {
        if (userInputCellNotes[note - 1].show !== possibleCellNotes[note - 1].show) return false
        if (possibleCellNotes[note - 1].show) visibleNotesCount++
    }

    return visibleNotesCount === 1
}
