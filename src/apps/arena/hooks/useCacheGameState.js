import { useEffect } from 'react'

import { useSelector } from 'react-redux'

import { usePreviousRenderValue } from '../../../utils/customHooks'

import { getGameState } from '../store/selectors/gameState.selectors'
import { cacheGameData } from '../utils/cacheGameHandler'
import { shouldSaveDataOnGameStateChange } from '../utils/util'

export const useCacheGameState = (key, data) => {
    const gameState = useSelector(getGameState)
    const previousGameState = usePreviousRenderValue(gameState)

    useEffect(() => {
        if (shouldSaveDataOnGameStateChange(gameState, previousGameState)) {
            cacheGameData(key, data)
        }
    }, [key, data, gameState, previousGameState])
}
