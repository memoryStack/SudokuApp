import { RawHintTransformersArgs } from '../../types'

import { XYZWingRawHint } from '../../xyzWing/types'

export type XYZWingTransformerArgs = Omit<RawHintTransformersArgs, 'rawHint'> & { rawHint: XYZWingRawHint }
