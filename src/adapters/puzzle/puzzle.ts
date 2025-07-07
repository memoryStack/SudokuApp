import { RNSudokuPuzzle } from 'fast-sudoku-puzzles'

import type { PuzzleAdapter } from '@application/adapterInterfaces/puzzleGenerator'
import { HINTS_IDS } from 'src/apps/arena/utils/smartHints/constants'
import { Game } from '@application/usecases/generateAndStartNewGame'
import { ALL_PUZZLES } from './constants'
import { transformRawPuzzleToStateMainNumbers } from '@domain/board/utils/puzzleDataTransformers'

type RawHints = {
    [hintId: string]: object
}

const convertPuzzleStringToArrayOfNumbers = (puzzle: string) => {
    const result = []
    for (let i = 0; i < puzzle.length; i++) {
        result.push(Number(puzzle[i]))
    }
    return result
}

const getSudokuPuzzle = async ({ difficultyLevel, levelNum }: Game): Promise<MainNumbers> => {
    const puzzle = ALL_PUZZLES[difficultyLevel]?.[levelNum - 1]
    if (!puzzle) throw `Invalid difficultyLevel ${difficultyLevel} or levelNum ${levelNum}`
    return transformRawPuzzleToStateMainNumbers({
        clues: convertPuzzleStringToArrayOfNumbers(puzzle.clues),
        solution: convertPuzzleStringToArrayOfNumbers(puzzle.solution)
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
