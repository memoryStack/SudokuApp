export const isValidNakedGroup = ({ groupCandidates, hostCells }, possibleNotes) => {
    const extraCandidatePossible = hostCells.some(({ row, col }) => possibleNotes[row][col].some(({ show, noteValue }) => show && !groupCandidates.includes(noteValue)))
    return !extraCandidatePossible
}
