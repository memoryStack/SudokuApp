import { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { EVENTS, PENCIL_STATE } from '../../../resources/constants'
import { addListener, removeListener } from '../../../utils/GlobalEventBus'
import { updatePencil } from '../store/actions/boardController.actions'
import { getPencilStatus } from '../store/selectors/boardController.selectors'
import { cacheGameData, GAME_DATA_KEYS } from '../utils/cacheGameHandler'

const MAX_AVAILABLE_HINTS = 3

const initCellActionsData = () => {
    return {
        pencilState: PENCIL_STATE.INACTIVE,
        hints: MAX_AVAILABLE_HINTS,
    }
}

// TODO: let's think of better naming for this set of operations on a cell
const useCellActions = () => {

    const pencilState = useSelector(getPencilStatus)

    const initialCellActionsData = useRef(initCellActionsData()).current
    const [hints, setHints] = useState(initialCellActionsData.hints)

    useEffect(() => {
        const handler = previousGameData => {
            const { hints, pencilState } = previousGameData[GAME_DATA_KEYS.CELL_ACTIONS]
            updatePencil(pencilState)
            setHints(hints)
        }
        addListener(EVENTS.RESUME_PREVIOUS_GAME, handler)
        return () => removeListener(EVENTS.RESUME_PREVIOUS_GAME, handler)
    }, [])

    const dataResetHandler = () => {
        setHints(MAX_AVAILABLE_HINTS)
        updatePencil(PENCIL_STATE.INACTIVE)
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
        hints,
    }
}

export { MAX_AVAILABLE_HINTS, useCellActions }
