import { GAME_LEVEL_VS_CLUES } from "../constants"

import type { Dependencies } from '../type'
import { AUTO_GENERATED_NEW_GAME_IDS, NEW_GAME_IDS } from "./newGameMenu/constants"
import { startGameUseCase } from "./startGameUseCase"

export const generateAndStartNewGameUseCase = async (gameLevel: AUTO_GENERATED_NEW_GAME_IDS, dependencies: Dependencies) => {
    const { puzzle } = dependencies
    return puzzle.getSudokuPuzzle(GAME_LEVEL_VS_CLUES[gameLevel])
        .then((mainNumbers: MainNumbers) => {
            startGameUseCase({
                mainNumbers,
                difficultyLevel: gameLevel as unknown as NEW_GAME_IDS,
                dependencies
            })
        })
        .catch(error => {
            // what to do in this case ??
        })
}
