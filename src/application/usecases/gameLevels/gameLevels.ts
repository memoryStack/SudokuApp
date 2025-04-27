import { Dependencies } from "@application/type"
import { AUTO_GENERATED_NEW_GAME_IDS } from "../newGameMenu/constants"
import { GameLevelsInfo, Level } from "./type"
import { LEVEL_STATES } from "./constants"
import { COMPLETED_GAME_STATS } from "@application/adapterInterfaces/gameLevels"
import { ALL_PUZZLES } from "@adapters/puzzle/constants"

const sortLevelsList = (levels: Level[]) => {
    levels.sort((levelA: Level, levelB: Level) => {
        return levelA.levelNum - levelB.levelNum
    })
}

export const getGameLevelsUseCase = async (
    selectedLevel: AUTO_GENERATED_NEW_GAME_IDS,
    dependencies: Dependencies
): Promise<GameLevelsInfo> => {
    const { gameLevelsAdapter } = dependencies
    const { levels: completedGames, starsEarned } = await gameLevelsAdapter.getGameLevels(selectedLevel)

    const MAX_GAMES_IN_LEVEL = ALL_PUZZLES[selectedLevel].length

    const maxStars = MAX_GAMES_IN_LEVEL * 3 // TODO : put it in a central place

    if (completedGames.length === MAX_GAMES_IN_LEVEL) {
        sortLevelsList(completedGames)
        return {
            levels: completedGames,
            nextPuzzleIndex: completedGames.length - 1,
            maxStars,
            starsEarned
        }
    }

    let solvedLevelsMap: { [key: Level['levelNum']]: boolean } = {}
    completedGames.forEach((level) => {
        solvedLevelsMap[level.levelNum] = true
    })

    let nextPuzzleNum = -1
    for (let levelNum = 1; levelNum <= MAX_GAMES_IN_LEVEL; levelNum++) {
        if (!solvedLevelsMap[levelNum]) {
            nextPuzzleNum = levelNum
            break
        }
    }

    for (let levelNum = 1; levelNum <= MAX_GAMES_IN_LEVEL; levelNum++) {
        if (!solvedLevelsMap[levelNum]) {
            completedGames.push({
                levelNum,
                activeStars: 0,
                state: levelNum === nextPuzzleNum ? LEVEL_STATES.UNLOCKED : LEVEL_STATES.LOCKED
            })
        }
    }

    sortLevelsList(completedGames)
    return { levels: completedGames, nextPuzzleIndex: nextPuzzleNum - 1, maxStars, starsEarned }
}

export const saveCompletedGame = async (
    gameStats: COMPLETED_GAME_STATS,
    dependencies: Dependencies
) => {
    const { gameLevelsAdapter } = dependencies
    gameLevelsAdapter.saveCompletedGame(gameStats)
}
