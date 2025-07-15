import { RNSudokuPuzzle } from 'fast-sudoku-puzzles'

import type { PuzzleAdapter } from '@application/adapterInterfaces/puzzleGenerator'
import { transformNativeGeneratedPuzzle } from './nativeGeneratedPuzzleTransformer'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'

type GeneratedPuzzle = {
    clues: number[]
    solution: number[]
}

type RawHints = {
    [hintId: string]: object
}

const getSudokuPuzzle = async (minClues: number = 80): Promise<MainNumbers> => {
    console.log('@@@@@ minClues', minClues)
    return RNSudokuPuzzle.getSudokuPuzzle(minClues).then((_puzzle: GeneratedPuzzle) => {
        const clues = '760059080050100004000700000603090820005020600021070405000006000900008040010540036'.split("").map((char) => {
            return parseInt(char)
        })
        const solution = '764359182359182764182764359673495821495821673821673495547936218936218547218547936'.split("").map((char) => {
            return parseInt(char)
        })

        console.log('@@@@@ clurs', clues)

        return transformNativeGeneratedPuzzle({
            clues,
            solution
        })
    })
}

const validatePuzzle = (puzzle: string) => RNSudokuPuzzle.validatePuzzle(puzzle)

const getRawHints = (puzzle: string, notes: Notes, disabledHints: string[]): Promise<RawHints> => {
    return RNSudokuPuzzle.getRawHints(puzzle, notes, disabledHints)
        .then((data) => {
            return data
        })
}

export const Puzzle: PuzzleAdapter = {
    getSudokuPuzzle,
    validatePuzzle,
    getRawHints,
}
