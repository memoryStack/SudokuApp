import { useRef, useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { GAME_STATE, EVENTS, PENCIL_STATE } from '../../../resources/constants'
import { addListener, emit, removeListener } from '../../../utils/GlobalEventBus'
import { getGameState } from '../store/selectors/gameState.selectors'
import { cacheGameData, GAME_DATA_KEYS } from '../utils/cacheGameHandler'

const MAX_AVAILABLE_HINTS = 3

const initCellActionsData = () => {
    return {
        pencilState: PENCIL_STATE.INACTIVE,
        hints: MAX_AVAILABLE_HINTS,
    }
}

const getNewPencilState = currentState => {
    if (!currentState) return PENCIL_STATE.INACTIVE
    return currentState === PENCIL_STATE.ACTIVE ? PENCIL_STATE.INACTIVE : PENCIL_STATE.ACTIVE
}

// TODO: let's think of better naming for this set of operations on a cell
const useCellActions = () => {

    const gameState = useSelector(getGameState)

    const initialCellActionsData = useRef(initCellActionsData()).current
    const [pencilState, setPencilState] = useState(initialCellActionsData.pencilState)
    const [hints, setHints] = useState(initialCellActionsData.hints)

    useEffect(() => {
        const handler = previousGameData => {
            const { hints, pencilState } = previousGameData[GAME_DATA_KEYS.CELL_ACTIONS]
            setPencilState(pencilState)
            setHints(hints)
        }
        addListener(EVENTS.RESUME_PREVIOUS_GAME, handler)
        return () => removeListener(EVENTS.RESUME_PREVIOUS_GAME, handler)
    }, [])

    const dataResetHandler = () => {
        setHints(MAX_AVAILABLE_HINTS)
        setPencilState(PENCIL_STATE.INACTIVE)
    }

    useEffect(() => {
        addListener(EVENTS.START_NEW_GAME, dataResetHandler)
        return () => removeListener(EVENTS.START_NEW_GAME, dataResetHandler)
    }, [])

    useEffect(() => {
        addListener(EVENTS.RESTART_GAME, dataResetHandler)
        return () => removeListener(EVENTS.RESTART_GAME, dataResetHandler)
    }, [])

    useEffect(() => {
        const handler = () => {
            const cellActionsData = {
                pencilState,
                hints,
            }
            cacheGameData(GAME_DATA_KEYS.CELL_ACTIONS, cellActionsData)
        }

        addListener(EVENTS.CACHE_GAME_DATA, handler)
        return () => removeListener(EVENTS.CACHE_GAME_DATA, handler)
    }, [pencilState, hints])

    // hint used successfully
    useEffect(() => {
        const handler = () => {
            setHints(hints => hints - 1)
        }
        addListener(EVENTS.HINT_USED_SUCCESSFULLY, handler)
        return () => removeListener(EVENTS.HINT_USED_SUCCESSFULLY, handler)
    }, [])

    return {
        pencilState,
        hints,
    }
}

export { MAX_AVAILABLE_HINTS, useCellActions }
