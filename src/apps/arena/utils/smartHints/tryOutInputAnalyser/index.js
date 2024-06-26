import { HINTS_IDS } from '../constants'

import { hiddenGroupTryOutAnalyser } from './hiddenGroups'
import { perfectXWingTryOutAnalyser, finnedXWingTryOutAnalyser } from './xWings'
import { nakedDoubleTryOutAnalyser, nakedTrippleTryOutAnalyser } from './nakedGroups'
import { yWingTryOutAnalyser } from './yWing'
import { remotePairsTryOutAnalyser } from './remotePairs'
import { xChainTryOutAnalyser } from './xChain'
import { emptyRectangleTryOutAnalyser } from './emptyRectangle'
import { wWingTryOutAnalyser } from './wWing'
import { xyzWingTryOutAnalyser } from './xyzWing'

const tryOutAnalysers = {
    [HINTS_IDS.NAKED_DOUBLE]: nakedDoubleTryOutAnalyser,
    [HINTS_IDS.NAKED_TRIPPLE]: nakedTrippleTryOutAnalyser,
    [HINTS_IDS.HIDDEN_DOUBLE]: hiddenGroupTryOutAnalyser,
    [HINTS_IDS.HIDDEN_TRIPPLE]: hiddenGroupTryOutAnalyser,
    [HINTS_IDS.PERFECT_X_WING]: perfectXWingTryOutAnalyser,
    [HINTS_IDS.FINNED_X_WING]: finnedXWingTryOutAnalyser,
    [HINTS_IDS.SASHIMI_FINNED_X_WING]: finnedXWingTryOutAnalyser,
    [HINTS_IDS.Y_WING]: yWingTryOutAnalyser,
    [HINTS_IDS.REMOTE_PAIRS]: remotePairsTryOutAnalyser,
    [HINTS_IDS.X_CHAIN]: xChainTryOutAnalyser,
    [HINTS_IDS.EMPTY_RECTANGLE]: emptyRectangleTryOutAnalyser,
    [HINTS_IDS.W_WING]: wWingTryOutAnalyser,
    [HINTS_IDS.XYZ_WING]: xyzWingTryOutAnalyser,
}

export const analyseTryOutInput = ({ hintType, data, boardInputs }) => {
    const handler = tryOutAnalysers[hintType]
    if (handler) {
        return handler(data, boardInputs)
    }
    throw new Error('invalid type of hint try-out requested for analysing')
}
