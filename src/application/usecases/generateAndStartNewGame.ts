import { LEVELS_CLUES_INFO, LEVEL_DIFFICULTIES } from "../constants"

import type { Dependencies } from '../type'
import { startGameUseCase } from "./startGameUseCase"

export const generateAndStartNewGameUseCase = async (difficultyLevel: LEVEL_DIFFICULTIES, dependencies: Dependencies) => {
    const { newPuzzleGenerator } = dependencies
    return newPuzzleGenerator.getSudokuPuzzle(LEVELS_CLUES_INFO[difficultyLevel])
        .then((mainNumbers: MainNumbers) => {
            startGameUseCase({ mainNumbers, difficultyLevel, dependencies })
        })
        .catch(error => {
            // what to do in this case ??
        })
}
