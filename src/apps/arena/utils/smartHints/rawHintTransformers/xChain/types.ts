import { RawHintTransformersArgs } from '../../types'
import { XChainRawHint } from '../../chains/xChain/types'

export type XChainTransformerArgs = Omit<RawHintTransformersArgs, 'rawHint'> & { rawHint: XChainRawHint }
