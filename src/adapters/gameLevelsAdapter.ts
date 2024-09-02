
import { GameLevelsAdapter } from "@application/adapterInterfaces/gameLevels"
import { Time } from "@application/adapterInterfaces/stateManagers/refreeRepository"
import { LEVEL_STATES } from "@application/usecases/gameLevels/constants"
import { AUTO_GENERATED_NEW_GAME_IDS } from "@application/usecases/newGameMenu/constants"
import _map from "@lodash/map"
import { getKey, setKey } from "@utils/storage"
import { COMPLETED_GAME_STATS } from "@application/adapterInterfaces/gameLevels"
import _get from "@lodash/get"
import _cloneDeep from "@lodash/cloneDeep"

const COMPLETED_LEVELS_STORAGE_KEY = 'completed_levels'

type COMPLETED_GAMES = {
    [key: AUTO_GENERATED_NEW_GAME_IDS]: {
        levels: COMPLETED_GAME_STATS[],
        totalStarsEarned: number, // sum of all the stars in all the completed levels
        bestTime: Time, // TODO: let's store the number of seconds instead of hours: , minutes: , seconds: object for brevity
    }
}

// TODO: move it to some utils
const getSmallerTime = (timeA: Time, timeB: Time) => {
    if (timeA.hours < timeB.hours) return timeA
    if (timeA.minutes < timeB.minutes) return timeA
    return (timeA.seconds < timeB.seconds) ? timeA : timeB
}

export const gameLevelsAdapter: GameLevelsAdapter = {
    getGameLevels: async (selectedLevel) => {
        const completedGames: COMPLETED_GAMES = await getKey(COMPLETED_LEVELS_STORAGE_KEY)
        const completedLevels = _get(completedGames, [selectedLevel, 'levels'], [])
        return _map(completedLevels, (game: COMPLETED_GAME_STATS) => {
            return {
                levelNum: game.levelNum,
                activeStars: game.starsEarned,
                state: LEVEL_STATES.COMPLETED
            }
        })
    },
    saveCompletedGame: async (gameStats: COMPLETED_GAME_STATS) => {
        const allCompletedGames: COMPLETED_GAMES = await getKey(COMPLETED_LEVELS_STORAGE_KEY) || {}
        const levelsCompletedYet = _get(allCompletedGames, [gameStats.level, 'levels'], [])
        const starsEarnedYet = _get(allCompletedGames, [gameStats.level, 'totalStarsEarned'], 0)
        const bestTimeYet = _get(allCompletedGames, [gameStats.level, 'bestTime'], { hours: 0, minutes: 0, seconds: 0 }) // TODO: get this from a central constants

        const finalCompletedLevels = _cloneDeep(levelsCompletedYet)
        if (gameStats.levelNum > levelsCompletedYet.length) {
            finalCompletedLevels.push(gameStats)
        } else {
            finalCompletedLevels[gameStats.levelNum - 1] = gameStats
        }

        allCompletedGames[gameStats.level] = {
            levels: finalCompletedLevels,
            totalStarsEarned: starsEarnedYet + gameStats.starsEarned,
            bestTime: getSmallerTime(bestTimeYet, gameStats.time),
        }
        await setKey(COMPLETED_LEVELS_STORAGE_KEY, allCompletedGames)
    }
}
