import { HIDDEN_SINGLE_TYPES } from '../constants'

export type HiddenSingleRawHint = {
    isComposite: boolean
    cell: Cell
    mainNumber: MainNumberValue
    type: HIDDEN_SINGLE_TYPES
}
