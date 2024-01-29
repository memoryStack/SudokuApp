import { RawHintTransformersArgs } from '../../types'

import { EmptyRectangleRawHint } from '../../emptyRectangle/types'

export type EmptyRectangleTransformerArgs = Omit<RawHintTransformersArgs, 'rawHint'> & { rawHint: EmptyRectangleRawHint }
