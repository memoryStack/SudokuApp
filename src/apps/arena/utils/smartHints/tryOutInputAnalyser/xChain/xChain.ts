import { XChainRawHint } from '../../xChain/types'

import { TRY_OUT_RESULT_STATES } from '../constants'
import {
    noInputInTryOut,
} from '../helpers'
import { BoardInputs } from '../types'

export const xChainTryOutAnalyser = (
    { xChain }: { xChain: XChainRawHint },
    boardInputs: BoardInputs,
) => {
    const { chain, removableNotesHostCells } = xChain

    if (noInputInTryOut([...chain, ...removableNotesHostCells], boardInputs)) {
        return {
            msg: '@@@@@',
            state: TRY_OUT_RESULT_STATES.START,
        }
    }

    return {
        msg: '@@@@@',
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}
