import { MAX_AVAILABLE_HINTS } from '../state/boardController.state'

const stateHandlers = {
    resetState: (state, { payload }) => {
        state.pencilState = payload.pencilState
        state.hintsLeft = payload.hintsLeft
        state.showHintsMenu = payload.showHintsMenu
    },
    setPencil: (state, { payload }) => {
        state.pencilState = payload
    },
    decreaseHint: state => {
        state.hintsLeft -= 1
    },
    setHints: (state, { payload }) => {
        // TODO: is this really needed ??
        state.hintsLeft = payload
    },
    resetHints: state => {
        state.hintsLeft = MAX_AVAILABLE_HINTS
    },
    setHintsMenu: (state, { payload }) => {
        state.showHintsMenu = payload
    },
}

export default stateHandlers
