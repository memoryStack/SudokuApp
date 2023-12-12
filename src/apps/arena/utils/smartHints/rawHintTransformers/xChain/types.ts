import { RawHintTransformersArgs } from '../../types'
import { XChainRawHint } from '../../xChain/types'

export type XChainTransformerArgs = Omit<RawHintTransformersArgs, 'rawHint'> & { rawHint: XChainRawHint }
