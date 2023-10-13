import { NakedSingleRawHint } from '../../nakedSingle/types'
import { RawHintTransformersArgs } from '../../types'

export type NakedSingleTransformerArgs = Omit<RawHintTransformersArgs, 'rawHint'> & { rawHint: NakedSingleRawHint }
