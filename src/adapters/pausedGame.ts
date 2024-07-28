import type { PausedGameData, PausedGameAdapter } from '@application/adapterInterfaces/pausedGame'
import _isEmpty from '@lodash/isEmpty'
import { getKey, setKey } from '@utils/storage'
import { GAME_DATA_KEYS, PREVIOUS_GAME_DATA_KEY } from 'src/apps/arena/utils/cacheGameHandler'

/*
    this function will know the format in which data is stored in persistence
    layer and in which format is it needed by the application layer
*/

const getPausedGameData = async () => {
    return getKey(PREVIOUS_GAME_DATA_KEY)
        .then((pausedGameData) => {
            if (_isEmpty(pausedGameData)) return null
            const transformedGameData: PausedGameData = {
                gameState: pausedGameData[GAME_DATA_KEYS.STATE],
                ...pausedGameData[GAME_DATA_KEYS.BOARD_DATA],
                ...pausedGameData[GAME_DATA_KEYS.REFEREE],
                ...pausedGameData[GAME_DATA_KEYS.CELL_ACTIONS],
            }
            return transformedGameData
        })
}

const removePausedGameData = async () => {
    return setKey(PREVIOUS_GAME_DATA_KEY, {})
}

export const pausedGameAdapter: PausedGameAdapter = {
    getPausedGameData,
    removePausedGameData
}
