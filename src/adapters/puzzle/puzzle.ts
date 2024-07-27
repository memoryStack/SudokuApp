import { RNSudokuPuzzle } from 'fast-sudoku-puzzles'

import type { NewPuzzleGenerator } from '@application/adapterInterfaces/puzzleGenerator'
import { transformNativeGeneratedPuzzle } from './nativeGeneratedPuzzleTransformer'

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

const getSudokuPuzzle = async (minClues: number): Promise<MainNumbers> => {
    return RNSudokuPuzzle.getSudokuPuzzle(minClues).then((puzzle: GeneratedPuzzle) => {
        return transformNativeGeneratedPuzzle(puzzle)
    })
}

const validatePuzzle = (puzzle: string): Promise<PuzzleValidationResult> => RNSudokuPuzzle.validatePuzzle(puzzle)

const getRawHints = (puzzle: string, notes: Notes, disabledHints: string[]): Promise<RawHints> => {
    return RNSudokuPuzzle.getRawHints(puzzle, notes, disabledHints)
}

export const Puzzle: NewPuzzleGenerator = {
    getSudokuPuzzle,
    validatePuzzle,
    getRawHints,
}
