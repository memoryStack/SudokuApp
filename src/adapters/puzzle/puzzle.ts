import { RNSudokuPuzzle } from 'fast-sudoku-puzzles'

type PuzzleValidationResult = {
    count: number
    solution: number[]
}

type GeneratedPuzzle = {
    clues: number[]
    solution: number[]
}

type RawHints = {
    [hintId: string]: object
}

const getSudokuPuzzle = (minClues: number): Promise<GeneratedPuzzle> => RNSudokuPuzzle.getSudokuPuzzle(minClues)

const validatePuzzle = (puzzle: string): Promise<PuzzleValidationResult> => RNSudokuPuzzle.validatePuzzle(puzzle)

const getRawHints = (puzzle: string, notes: Notes, disabledHints: string[]): Promise<RawHints> => {
    return RNSudokuPuzzle.getRawHints(puzzle, notes, disabledHints)
}

export const Puzzle = {
    getSudokuPuzzle,
    validatePuzzle,
    getRawHints,
}
