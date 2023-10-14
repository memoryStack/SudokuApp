import { RawHintTransformersArgs } from '../../types'
import { HiddenSingleRawHint } from '../../hiddenSingle/types'

export type HiddenSingleTransformerArgs = Omit<RawHintTransformersArgs, 'rawHint'> & { rawHint: HiddenSingleRawHint }
