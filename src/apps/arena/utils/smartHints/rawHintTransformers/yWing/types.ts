import { RawHintTransformersArgs } from '../../types'
import { YWingRawHint } from '../../yWing/types'

export type YWingTransformerArgs = Omit<RawHintTransformersArgs, 'rawHint'> & { rawHint: YWingRawHint }
