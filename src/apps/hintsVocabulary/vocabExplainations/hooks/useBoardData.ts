import { getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'
import { useEffect, useState } from 'react'

type BoardData = {
    mainNumbers: MainNumbers
    notes: Notes
}

export const useBoardData = (puzzle: string) => {
    const [boardData, setBoardData] = useState<BoardData>({ mainNumbers: null, notes: null } as unknown as BoardData)

    useEffect(() => {
        setTimeout(() => {
            const generatePossibleNotes = false
            const { mainNumbers, notes } = getPuzzleDataFromPuzzleString(puzzle, generatePossibleNotes)
            setBoardData({ mainNumbers, notes } as BoardData)
        })
    }, [puzzle])

    return boardData
}
