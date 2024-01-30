import { RawHintTransformersArgs } from '../../types'

import { WWingRawHint } from '../../wWing/types'

export type WWingTransformerArgs = Omit<RawHintTransformersArgs, 'rawHint'> & { rawHint: WWingRawHint }
