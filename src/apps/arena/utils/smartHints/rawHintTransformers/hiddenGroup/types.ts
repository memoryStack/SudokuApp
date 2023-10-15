import { RawHintTransformersArgs } from '../../types'

import { HiddenGroupRawHint } from '../../hiddenGroup/types'

export type HiddenGroupTransformerArgs = Omit<RawHintTransformersArgs, 'rawHint'> & { rawHint: HiddenGroupRawHint }
