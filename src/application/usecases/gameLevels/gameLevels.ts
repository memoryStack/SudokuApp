import { Dependencies } from "@application/type"
import { AUTO_GENERATED_NEW_GAME_IDS } from "../newGameMenu/constants"
import { GameLevelsInfo } from "./type"
import { LEVEL_STATES } from "./constants"
import { COMPLETED_GAME_STATS } from "@application/adapterInterfaces/gameLevels"

const MAX_GAMES_IN_LEVEL = 1000

export const getGameLevelsUseCase = async (
    selectedLevel: AUTO_GENERATED_NEW_GAME_IDS,
    dependencies: Dependencies
): Promise<GameLevelsInfo> => {
    const { gameLevelsAdapter } = dependencies
    const { levels: completedGames, starsEarned } = await gameLevelsAdapter.getGameLevels(selectedLevel)

    const maxStars = completedGames.length * 3 // TODO : put it in a central place

    if (completedGames.length === MAX_GAMES_IN_LEVEL) return {
        levels: completedGames,
        nextPuzzleIndex: completedGames.length - 1,
        maxStars,
        starsEarned
    }

    completedGames.push({
        levelNum: completedGames.length + 1,
        activeStars: 0,
        state: LEVEL_STATES.UNLOCKED
    })

    const nextPuzzleIndex = completedGames.length

    while (completedGames.length !== MAX_GAMES_IN_LEVEL) {
        completedGames.push({
            levelNum: completedGames.length + 1,
            activeStars: 0,
            state: LEVEL_STATES.LOCKED
        })
    }
    return { levels: completedGames, nextPuzzleIndex, maxStars, starsEarned }
}

export const saveCompletedGame = async (
    gameStats: COMPLETED_GAME_STATS,
    dependencies: Dependencies
) => {
    const { gameLevelsAdapter } = dependencies
    gameLevelsAdapter.saveCompletedGame(gameStats)
}
