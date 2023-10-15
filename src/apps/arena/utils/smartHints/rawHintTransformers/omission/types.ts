import { RawHintTransformersArgs } from '../../types'
import { RawOmissionHint } from '../../omission/types'

export type OmissionTransformerArgs = Omit<RawHintTransformersArgs, 'rawHint'> & { rawHint: RawOmissionHint }
