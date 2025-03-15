import { Game } from "@application/usecases/generateAndStartNewGame"

type PuzzleValidationResult = {
    count: number
    solution: number[]
}

export type PuzzleAdapter = {
    getSudokuPuzzle(game: Game): Promise<MainNumbers>
    validatePuzzle(puzzle: string): Promise<PuzzleValidationResult>
}
