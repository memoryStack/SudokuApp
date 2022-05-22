export const isValidNakedGroup = ({ groupCandidates, hostCells }, _, possibleNotes) => {
    const extraCandidatePossible = hostCells.some(({ row, col }) => {
        const cellNotes = possibleNotes[row][col]
        return cellNotes.some(({ show, noteValue }) => {
            if (!show) return false
            // can use includes here
            return groupCandidates.indexOf(noteValue) === -1
        })
    })

    return !extraCandidatePossible
}
