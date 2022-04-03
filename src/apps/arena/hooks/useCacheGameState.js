import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { usePrevious } from '../../../utils/customHooks/commonUtility'
import { consoleLog } from '../../../utils/util'
import { getGameState } from '../store/selectors/gameState.selectors'
import { cacheGameData } from '../utils/cacheGameHandler'
import { shouldSaveGameState } from '../utils/util'

export const useCacheGameState = (key, data) => {
    const gameState = useSelector(getGameState)
    const previousGameState = usePrevious(gameState)

    useEffect(() => {
        if (shouldSaveGameState(gameState, previousGameState)) cacheGameData(key, data)
    }, [key, data, gameState])
}
