import { RawHintTransformersArgs } from '../../types'
import { RemotePairsRawHint } from '../../remotePairs/types'

export type RemotePairsTransformerArgs = Omit<RawHintTransformersArgs, 'rawHint'> & { rawHint: RemotePairsRawHint }
