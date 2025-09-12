
import { GameLevelsAdapter } from "@application/adapterInterfaces/gameLevels"
import { Time } from "@application/adapterInterfaces/stateManagers/refreeRepository"
import { LEVEL_STATES } from "@application/usecases/gameLevels/constants"
import { AUTO_GENERATED_NEW_GAME_IDS } from "@application/usecases/newGameMenu/constants"
import _map from "@lodash/map"
import { getKey, setKey } from "@utils/storage"
import { COMPLETED_GAME_STATS, LEVEL_WISE_COMPLETED_GAMES } from "@application/adapterInterfaces/gameLevels"
import _get from "@lodash/get"
import _cloneDeep from "@lodash/cloneDeep"

const COMPLETED_LEVELS_STORAGE_KEY = 'completed_levels'

type COMPLETED_GAMES = Record<AUTO_GENERATED_NEW_GAME_IDS, LEVEL_WISE_COMPLETED_GAMES>

export const gameLevelsAdapter: GameLevelsAdapter = {
    getGameLevels: async (selectedLevel) => {
        const completedGames: COMPLETED_GAMES = await getKey(COMPLETED_LEVELS_STORAGE_KEY)
        const completedLevels = _get(completedGames, [selectedLevel, 'levels'], [])
        const unsolvedLevels = _get(completedGames, [selectedLevel, 'unsolvedLevels'], [])
        let totalStarsEarned = 0
        const levels = _map(completedLevels, (game: COMPLETED_GAME_STATS) => {
            totalStarsEarned += game.starsEarned
            return {
                levelNum: game.levelNum,
                activeStars: game.starsEarned,
                state: LEVEL_STATES.COMPLETED,
                unsolved: false
            }
        })
        unsolvedLevels.forEach((levelNum: number) => {
            levels.push({
                levelNum: levelNum,
                activeStars: 0,
                state: LEVEL_STATES.LOCKED,
                unsolved: true
            })
        })
        return { levels, starsEarned: totalStarsEarned }
    },
    getLevelCompletedGames: async (selectedLevel) => {
        const completedGames: COMPLETED_GAMES = await getKey(COMPLETED_LEVELS_STORAGE_KEY)
        return _get(completedGames, [selectedLevel], {})
    },
    saveLevelCompletedGames: async (selectedLevel, completedGames) => {
        const allCompletedGames: COMPLETED_GAMES = await getKey(COMPLETED_LEVELS_STORAGE_KEY) || {}
        allCompletedGames[selectedLevel] = { ...completedGames }
        await setKey(COMPLETED_LEVELS_STORAGE_KEY, allCompletedGames)
    }
}
