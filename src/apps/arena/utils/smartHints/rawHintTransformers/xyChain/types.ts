import { RawHintTransformersArgs } from '../../types'
import { XYChainRawHint } from '../../chains/xyChain/types'

export type XYChainTransformerArgs = Omit<RawHintTransformersArgs, 'rawHint'> & { rawHint: XYChainRawHint }
