import { EVENTS } from "../../../resources/constants"
import { emit } from "../../../utils/GlobalEventBus"

const handleHintClicked = () => emit(EVENTS.HINT_CLICKED)

const handleUndoClicked = () => emit(EVENTS.UNDO_CLICKED)

const handleEraserClicked = () => emit(EVENTS.ERASER_CLICKED)

const handlePencilClicked = () => emit(EVENTS.PENCIL_CLICKED)

const handleFastPencilClicked = () => emit(EVENTS.FAST_PENCIL_CLICKED)

const handleSelectCell = (data) => {
    const { selectedCell } = data
    if (!selectedCell) return
    emit(EVENTS.SELECT_CELL, selectedCell)
}

const handleInputNumberClicked = (data) => {
    const { number } = data
    if (!number) return
    emit(EVENTS.INPUT_NUMBER_CLICKED, data)
}

export const EventHandlers = {
    [EVENTS.SELECT_CELL]: handleSelectCell,
    [EVENTS.HINT_CLICKED]: handleHintClicked,
    [EVENTS.UNDO_CLICKED]: handleUndoClicked,
    [EVENTS.ERASER_CLICKED]: handleEraserClicked,
    [EVENTS.PENCIL_CLICKED]: handlePencilClicked,
    [EVENTS.FAST_PENCIL_CLICKED]: handleFastPencilClicked,
    [EVENTS.INPUT_NUMBER_CLICKED]: handleInputNumberClicked,
}
