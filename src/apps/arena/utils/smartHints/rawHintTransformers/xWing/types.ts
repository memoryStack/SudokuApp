import { RawHintTransformersArgs } from '../../types'
import { XWingRawHint } from '../../xWing/types'

export type XWingTransformerArgs = Omit<RawHintTransformersArgs, 'rawHint'> & { rawHint: XWingRawHint }
