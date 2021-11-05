import { emit } from '../../utils/GlobalEventBus'
import { EVENTS } from '../../resources/constants'

const selfExecuting = () => {
    // fire select_cell event
    let delay = 10000
    setTimeout(() => {
        emit(EVENTS.SELECT_CELL, { row: 4, col: 4 })
    }, delay)
    
    delay += 2000
    setTimeout(() => {
        emit(EVENTS.HINT_CLICKED)
    }, delay)
    
    delay += 2000
    setTimeout(() => {
        emit(EVENTS.UNDO_CLICKED)
    }, delay)

    delay += 2000
    setTimeout(() => {
        emit(EVENTS.HINT_CLICKED)
    }, delay)

    delay += 2000
    setTimeout(() => {
        emit(EVENTS.ERASER_CLICKED)
    }, delay)

    delay += 2000
    setTimeout(() => {
        emit(EVENTS.PENCIL_CLICKED)
    }, delay)

    delay += 2000
    setTimeout(() => {
        emit(EVENTS.PENCIL_CLICKED)
    }, delay)

    delay += 2000
    setTimeout(() => {
        emit(EVENTS.FAST_PENCIL_CLICKED)
    }, delay)

    delay += 2000
    setTimeout(() => {
        emit(EVENTS.INPUT_NUMBER_CLICKED, { number: 1, takeLog: true })
    }, delay)

}

export { selfExecuting }
