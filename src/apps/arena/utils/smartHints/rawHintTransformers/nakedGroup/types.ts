import { RawHintTransformersArgs } from '../../types'
import { NakedGroupRawHint } from '../../nakedGroup/types'

export type NakedGroupTransformerArgs = Omit<RawHintTransformersArgs, 'rawHint'> & { rawHint: NakedGroupRawHint }
