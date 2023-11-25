import { RNSudokuPuzzle } from 'fast-sudoku-puzzles'

type PuzzleValidationResult = {
    count: number
    solution: number[]
}

type GeneratedPuzzle = {
    clues: number[]
    solution: number[]
}

const getSudokuPuzzle = (minClues: number): Promise<GeneratedPuzzle> => RNSudokuPuzzle.getSudokuPuzzle(minClues)
const validatePuzzle = (puzzle: string): Promise<PuzzleValidationResult> => RNSudokuPuzzle.validatePuzzle(puzzle)

export const Puzzle = {
    getSudokuPuzzle,
    validatePuzzle,
}
