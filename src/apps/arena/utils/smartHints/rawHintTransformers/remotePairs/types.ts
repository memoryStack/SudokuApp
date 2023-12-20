import { RawHintTransformersArgs } from '../../types'
import { RemotePairsRawHint } from '../../chains/remotePairs/types'

export type RemotePairsTransformerArgs = Omit<RawHintTransformersArgs, 'rawHint'> & { rawHint: RemotePairsRawHint }
