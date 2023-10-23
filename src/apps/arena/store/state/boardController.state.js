import { PENCIL_STATE } from '@resources/constants'

export const MAX_AVAILABLE_HINTS = 3

export const INITIAL_STATE = {
    pencilState: PENCIL_STATE.INACTIVE,
    hintsLeft: MAX_AVAILABLE_HINTS,
    showHintsMenu: false,
}
