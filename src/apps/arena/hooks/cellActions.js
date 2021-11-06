import { useRef, useState, useEffect, useCallback } from 'react'
import { GAME_STATE, EVENTS, PENCIL_STATE, PREVIOUS_GAME } from '../../../resources/constants'
import { addListener, emit, removeListener } from '../../../utils/GlobalEventBus'
import { getKey } from '../../../utils/storage'

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
const useCellActions = (gameState) => {    

    const initialCellActionsData = useRef(initCellActionsData()).current
    const [pencilState, setPencilState] = useState(initialCellActionsData.pencilState)
    const [hints, setHints] = useState(initialCellActionsData.hints)

    // get data from previous game
    // TODO: i guess this logic will be repeated in all hooks,
    // it's better to take it out and re-use it
    useEffect(async () => {
        const previousGame = await getKey(PREVIOUS_GAME)
        if (previousGame) {
            const { state, cellActionsData } = previousGame
            if (state === GAME_STATE.INACTIVE) {
                const { hints, pencilState } = cellActionsData
                setPencilState(pencilState)
                setHints(hints)
            }
        }
    }, [])

    // restart/reset/start new game the game
    useEffect(() => {
        const handler = () => {
            setHints(MAX_AVAILABLE_HINTS)
            setPencilState(PENCIL_STATE.INACTIVE)
        }
        addListener(EVENTS.RESTART_GAME, handler)
        return () => removeListener(EVENTS.RESTART_GAME, handler)
    }, [])

    // TODO: cache game stats
    useEffect(() => {

    }, [])

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
            setHints(hints => hints-1)
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

export  {
    MAX_AVAILABLE_HINTS,
    useCellActions,
}