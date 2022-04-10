export const isValidNakedGroup = ({ groupCandidates, hostCells }, _, possibleNotes) => {
    return hostCells.some(({ row, col }) => {
        const cellNotes = possibleNotes[row][col]
        return cellNotes.some(({ show, noteValue }) => {
            if (!show) return false
            return groupCandidates.indexOf(noteValue) === -1
        })
    })
}
