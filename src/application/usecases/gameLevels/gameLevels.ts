import { Dependencies } from "@application/type"
import { AUTO_GENERATED_NEW_GAME_IDS } from "../newGameMenu/constants"
import { GameLevelsInfo, Level } from "./type"
import { LEVEL_STATES } from "./constants"
import { COMPLETED_GAME_STATS, LEVEL_WISE_COMPLETED_GAMES } from "@application/adapterInterfaces/gameLevels"
import { ALL_PUZZLES } from "@adapters/puzzle/constants"
import _get from "@lodash/get"
import _cloneDeep from "@lodash/cloneDeep"
import { getSmallerTime } from "@application/utils/util"

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
    // completed means solved + unsolved levels
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
                state: levelNum === nextPuzzleNum ? LEVEL_STATES.UNLOCKED : LEVEL_STATES.LOCKED,
                unsolved: false,
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
    const alreadyCompletedGames = await gameLevelsAdapter.getLevelCompletedGames(gameStats.level)

    const levelsCompletedYet = _get(alreadyCompletedGames, ['levels'], [])
    const starsEarnedYet = _get(alreadyCompletedGames, ['totalStarsEarned'], 0)
    const bestTimeYet = _get(alreadyCompletedGames, ['bestTime'], { hours: 0, minutes: 0, seconds: 0 }) // TODO: get this from a central constants
    const unsolvedLevels: LEVEL_WISE_COMPLETED_GAMES['unsolvedLevels'] = _get(alreadyCompletedGames, ['unsolvedLevels'], [])

    const puzzleAlreadySolvedIndx = levelsCompletedYet.findIndex(({ levelNum: alreadySolvedLevelNum }: COMPLETED_GAME_STATS) => {
        return alreadySolvedLevelNum === gameStats.levelNum
    })

    let starsDiff = 0
    const finalCompletedLevels = _cloneDeep(levelsCompletedYet)
    if (puzzleAlreadySolvedIndx !== -1) {
        const puzzleAlreadySolvedStats = levelsCompletedYet[puzzleAlreadySolvedIndx]
        finalCompletedLevels[puzzleAlreadySolvedIndx] = gameStats
        starsDiff = gameStats.starsEarned - puzzleAlreadySolvedStats.starsEarned
    } else {
        finalCompletedLevels.push(gameStats)
        starsDiff += gameStats.starsEarned
    }

    return gameLevelsAdapter.saveLevelCompletedGames(gameStats.level, {
        levels: finalCompletedLevels,
        totalStarsEarned: starsEarnedYet + starsDiff,
        bestTime: getSmallerTime(bestTimeYet, gameStats.time),
        unsolvedLevels: unsolvedLevels.filter((levelNum) => levelNum !== gameStats.levelNum)
    })
}

export const saveUnsolvedGame = async (
    gameStats: COMPLETED_GAME_STATS,
    dependencies: Dependencies
) => {
    const { gameLevelsAdapter } = dependencies

    const alreadyCompletedGames = await gameLevelsAdapter.getLevelCompletedGames(gameStats.level)

    const levelsCompletedYet = _get(alreadyCompletedGames, ['levels'], [])
    const puzzleAlreadySolvedIndx = levelsCompletedYet.findIndex(({ levelNum: alreadySolvedLevelNum }: COMPLETED_GAME_STATS) => {
        return alreadySolvedLevelNum === gameStats.levelNum
    })
    const unsolvedLevels = _get(alreadyCompletedGames, ['unsolvedLevels'], [])
    if (puzzleAlreadySolvedIndx !== -1 || unsolvedLevels.includes(gameStats.levelNum)) return

    unsolvedLevels.push(gameStats.levelNum)
    return gameLevelsAdapter.saveLevelCompletedGames(gameStats.level, {
        ...alreadyCompletedGames,
        unsolvedLevels
    })
}
