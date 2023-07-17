import _forEach from '@lodash/forEach'
import _every from '@lodash/every'
import _isNil from '@lodash/isNil'

import { consoleLog } from '@utils/util'

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
    return _every(keys, key => !_isNil(dataToBeCached[key]))
}

const resetDataToBeCached = () => {
    const keys = Object.keys(dataToBeCached)
    _forEach(keys, key => {
        dataToBeCached[key] = null
    })
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
                resetDataToBeCached()
                consoleLog(error)
            })
    }
}

export { cacheGameData }
