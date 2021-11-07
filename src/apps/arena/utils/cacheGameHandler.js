import { setKey } from "../../../utils/storage";

const PREVIOUS_GAME_DATA_KEY = 'PREVIOUS_GAME'

const GAME_DATA_KEYS = {
    STATE: 'state',
    REFEREE: 'referee',
    BOARD_DATA: 'boardData',
    CELL_ACTIONS: 'cellActionsData',
}

const dataToBeCached = {
    [GAME_DATA_KEYS.STATE]: null,
    [GAME_DATA_KEYS.REFEREE]: null,
    [GAME_DATA_KEYS.BOARD_DATA]: null,
    [GAME_DATA_KEYS.CELL_ACTIONS]: null,
}

const shouldCacheData = () => {
    const keys = Object.keys(dataToBeCached)
    for (const key of keys)
        if (!dataToBeCached[key]) return false
    return true
}

const resetDataToBeCached = () => {
    const keys = Object.keys(dataToBeCached)
    for (const key of keys)
        dataToBeCached[key] = null
}

const cacheGameData = (key, data) => {
    if (!key) return

    dataToBeCached[key] = data
    if (shouldCacheData()) {
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

export { cacheGameData, GAME_DATA_KEYS, PREVIOUS_GAME_DATA_KEY }
