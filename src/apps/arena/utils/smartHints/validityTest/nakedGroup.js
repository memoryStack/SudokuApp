export const isValidNakedGroup = ({ groupCandidates, hostCells }, _, possibleNotes) => {
    const extraCandidatePossible = hostCells.some(({ row, col }) => {
        return possibleNotes[row][col].some(({ show, noteValue }) => {
            return show && !groupCandidates.includes(noteValue)
        })
    })
    return !extraCandidatePossible
}
