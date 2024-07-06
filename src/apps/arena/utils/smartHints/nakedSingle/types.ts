import { NAKED_SINGLE_TYPES } from '../constants'

export type NakedSingleRawHint = {
    isComposite: boolean
    cell: Cell
    mainNumber: MainNumberValue
    type: NAKED_SINGLE_TYPES
}
