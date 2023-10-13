import { NAKED_SINGLE_TYPES } from '../constants'
import { RawHintTransformersArgs } from '../types'

export type NakedSingleRawHint = {
    cell: Cell
    mainNumber: MainNumberValue
    type: NAKED_SINGLE_TYPES
}

export type NakedSingleTransformerArgs = Omit<RawHintTransformersArgs, 'rawHint'> & { rawHint: NakedSingleRawHint }
