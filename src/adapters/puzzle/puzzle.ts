import { RNSudokuPuzzle } from 'fast-sudoku-puzzles'

import type { PuzzleAdapter } from '@application/adapterInterfaces/puzzleGenerator'
import { transformNativeGeneratedPuzzle } from './nativeGeneratedPuzzleTransformer'
import { HINTS_IDS } from 'src/apps/arena/utils/smartHints/constants'

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

const validatePuzzle = (puzzle: string) => RNSudokuPuzzle.validatePuzzle(puzzle)

const getRawHints = (puzzle: string, notes: Notes, disabledHints: HINTS_IDS[]): Promise<RawHints> => {
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
