import { AUTO_GENERATED_NEW_GAME_IDS } from "@application/usecases/newGameMenu/constants"
import { Level } from "@application/usecases/gameLevels/type"

import { Time } from "./stateManagers/refreeRepository"

export type COMPLETED_GAME_STATS = {
    level: AUTO_GENERATED_NEW_GAME_IDS,
    levelNum: number,
    starsEarned: number,
    mistakes: number,
    time: Time,
    hintsUsed: number
}

export type CompletedLevelsDetails = {
    levels: Level[]
    starsEarned: number
}

export type GameLevelsAdapter = {
    getGameLevels: (selectedLevel: AUTO_GENERATED_NEW_GAME_IDS) => Promise<CompletedLevelsDetails>
    saveCompletedGame: (gameStats: COMPLETED_GAME_STATS) => Promise<void>
}
