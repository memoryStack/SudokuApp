type PuzzleValidationResult = {
    count: number
    solution: number[]
}

export type PuzzleAdapter = {
    getSudokuPuzzle(clues: number): Promise<MainNumbers>
    validatePuzzle(puzzle: string): Promise<PuzzleValidationResult>
}
