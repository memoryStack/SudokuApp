import { Dependencies } from "@application/type"
import { AUTO_GENERATED_NEW_GAME_IDS } from "../newGameMenu/constants"
import { Level } from "./type"
import { LEVEL_STATES } from "./constants"
import { COMPLETED_GAME_STATS } from "@application/adapterInterfaces/gameLevels"

const MAX_GAMES_IN_LEVEL = 1000

export const getGameLevelsUseCase = async (
    selectedLevel: AUTO_GENERATED_NEW_GAME_IDS,
    dependencies: Dependencies
): Promise<Level[]> => {
    const { gameLevelsAdapter } = dependencies
    const completedGames = await gameLevelsAdapter.getGameLevels(selectedLevel)

    if (completedGames.length === MAX_GAMES_IN_LEVEL) return completedGames

    completedGames.push({
        levelNum: completedGames.length + 1,
        activeStars: 0,
        state: LEVEL_STATES.UNLOCKED
    })

    while (completedGames.length !== MAX_GAMES_IN_LEVEL) {
        completedGames.push({
            levelNum: completedGames.length + 1,
            activeStars: 0,
            state: LEVEL_STATES.LOCKED
        })
    }
    return completedGames
}

export const saveCompletedGame = async (
    gameStats: COMPLETED_GAME_STATS,
    dependencies: Dependencies
) => {
    const { gameLevelsAdapter } = dependencies
    gameLevelsAdapter.saveCompletedGame(gameStats)
}
