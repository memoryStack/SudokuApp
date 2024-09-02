import { PENCIL_STATE } from '@resources/constants'

export const MAX_AVAILABLE_HINTS = Number.POSITIVE_INFINITY

export const INITIAL_STATE = {
    pencilState: PENCIL_STATE.INACTIVE,
    hintsLeft: MAX_AVAILABLE_HINTS,
    showHintsMenu: false,
    hintsUsed: 0,
}
