import { forCellEachNote } from "../../util"

export const isValidNakedSingle = ({ cell }, _, possibleNotes) => {
    const cellPossibleNotes = possibleNotes[cell.row][cell.col]

    let possibleNotesCount = 0
    forCellEachNote((_, noteIndx) => {
        if (cellPossibleNotes[noteIndx].show) possibleNotesCount++
    })

    return possibleNotesCount === 1
}
