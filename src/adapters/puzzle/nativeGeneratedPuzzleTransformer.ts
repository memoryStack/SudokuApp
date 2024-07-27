import { CELLS_IN_A_HOUSE } from "@domain/board/board.constants"
import { convertBoardCellToNum } from "@domain/board/utils/cellsTransformers"

export const transformNativeGeneratedPuzzle = ({ clues, solution }): MainNumbers => {
    const mainNumbers = []
    for (let row = 0; row < CELLS_IN_A_HOUSE; row++) {
        const rowData = []
        for (let col = 0; col < CELLS_IN_A_HOUSE; col++) {
            const cellNo = convertBoardCellToNum({ row, col })
            const cellvalue = clues[cellNo]
            rowData.push({
                value: cellvalue,
                solutionValue: solution[cellNo],
                isClue: cellvalue !== 0,
            })
        }
        mainNumbers.push(rowData)
    }
    return mainNumbers
}
