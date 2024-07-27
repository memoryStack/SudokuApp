export type NewPuzzleGenerator = {
    getSudokuPuzzle(clues: number): Promise<MainNumbers>
}
