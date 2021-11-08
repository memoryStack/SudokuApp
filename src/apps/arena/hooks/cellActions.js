import { useRef, useState, useEffect, useCallback } from 'react'
import { GAME_STATE, EVENTS, PENCIL_STATE } from '../../../resources/constants'
import { addListener, emit, removeListener } from '../../../utils/GlobalEventBus'
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
const useCellActions = gameState => {
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

    // pencil handlers
    const onPencilClick = useCallback(() => {
        if (gameState !== GAME_STATE.ACTIVE) return
        setPencilState(pencilState => getNewPencilState(pencilState))
    }, [gameState])

    const onHintClick = useCallback(() => {
        if (gameState !== GAME_STATE.ACTIVE) return
        emit(EVENTS.HINT_CLICKED)
    }, [gameState])

    // hint used successfully
    useEffect(() => {
        const handler = () => {
            setHints(hints => hints - 1)
        }
        addListener(EVENTS.HINT_USED_SUCCESSFULLY, handler)
        return () => removeListener(EVENTS.HINT_USED_SUCCESSFULLY, handler)
    }, [])

    // fast pencil click
    const onFastPencilClick = useCallback(() => {
        if (gameState !== GAME_STATE.ACTIVE) return
        emit(EVENTS.FAST_PENCIL_CLICKED)
    }, [gameState])

    // undo clicked
    const onUndoClick = useCallback(() => {
        if (gameState !== GAME_STATE.ACTIVE) return
        emit(EVENTS.UNDO_CLICKED)
    }, [gameState])

    return {
        pencilState,
        hints,
        onPencilClick,
        onHintClick,
        onFastPencilClick,
        onUndoClick,
    }
}

export { MAX_AVAILABLE_HINTS, useCellActions }
