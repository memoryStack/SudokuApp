import { setKey } from '../../../../utils/storage'

import { PREVIOUS_GAME_DATA_KEY, GAME_DATA_KEYS } from './constants'

const dataToBeCached = {
    [GAME_DATA_KEYS.STATE]: null,
    [GAME_DATA_KEYS.REFEREE]: null,
    [GAME_DATA_KEYS.BOARD_DATA]: null,
    [GAME_DATA_KEYS.CELL_ACTIONS]: null,
}

const dataReadyForCache = () => {
    const keys = Object.keys(dataToBeCached)
    for (const key of keys) if (!dataToBeCached[key]) return false
    return true
}

const resetDataToBeCached = () => {
    const keys = Object.keys(dataToBeCached)
    for (const key of keys) dataToBeCached[key] = null
}

const cacheGameData = (key, data) => {
    if (!key) return

    dataToBeCached[key] = data
    if (dataReadyForCache()) {
        setKey(PREVIOUS_GAME_DATA_KEY, dataToBeCached)
            .then(() => {
                resetDataToBeCached()
            })
            .catch(error => {
                __DEV__ && console.log(error)
                resetDataToBeCached()
            })
    }
}

export { cacheGameData }
