

import type { GetPausedGameData, PausedGameData } from '@application/adapterInterfaces/pausedGameDataGetter'
import { getKey } from '@utils/storage'
import { GAME_DATA_KEYS, PREVIOUS_GAME_DATA_KEY } from 'src/apps/arena/utils/cacheGameHandler'

/*
    this function will know the format in which data is stored in persistence
    layer and in which format is it needed by the application layer
*/

export const getPausedGameData: GetPausedGameData = async () => {
    return getKey(PREVIOUS_GAME_DATA_KEY)
        .then((pausedGameData) => {
            const transformedGameData: PausedGameData = {
                ...pausedGameData[GAME_DATA_KEYS.BOARD_DATA],
                ...pausedGameData[GAME_DATA_KEYS.REFEREE],
                ...pausedGameData[GAME_DATA_KEYS.CELL_ACTIONS],
            }
            return transformedGameData
        })
}
