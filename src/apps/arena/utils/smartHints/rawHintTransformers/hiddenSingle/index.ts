import { TransformedRawHint } from '../../types'

import { HiddenSingleTransformerArgs } from './types'
import { transformCompositeHiddenSingleRawHint } from './compositeHiddenSingle'
import { transformHiddenSingleRawHint as transformIndependentHiddenSingleRawHint } from './hiddenSingle'

export const transformHiddenSingleRawHint = ({ rawHint, ...rest }: HiddenSingleTransformerArgs): TransformedRawHint => {
    if (rawHint.isComposite || true) return transformCompositeHiddenSingleRawHint({ rawHint, ...rest })
    return transformIndependentHiddenSingleRawHint({ rawHint, ...rest })
}
