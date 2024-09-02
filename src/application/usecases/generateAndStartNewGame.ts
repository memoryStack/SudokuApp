import { GAME_LEVEL_VS_CLUES } from "../constants"

import type { Dependencies } from '../type'
import { AUTO_GENERATED_NEW_GAME_IDS, NEW_GAME_IDS } from "./newGameMenu/constants"
import { startGameUseCase } from "./startGameUseCase"

export type Game = {
    difficultyLevel: AUTO_GENERATED_NEW_GAME_IDS,
    levelNum: number
}

export const generateAndStartNewGameUseCase = async ({ difficultyLevel, levelNum }: Game, dependencies: Dependencies) => {
    const { puzzle } = dependencies
    return puzzle.getSudokuPuzzle(GAME_LEVEL_VS_CLUES[difficultyLevel])
        .then((mainNumbers: MainNumbers) => {
            startGameUseCase({
                mainNumbers,
                difficultyLevel: difficultyLevel as unknown as NEW_GAME_IDS,
                levelNum,
                dependencies
            })
        })
        .catch(error => {
            // what to do in this case ??
        })
}
