import { HINTS_IDS } from '../constants'

import nakedDoubleTryOutAnalyser from './nakedDouble'
import nakedTrippleTryOutAnalyser from './nakedTripple'
import hiddenGroupTryOutAnalyser from './hiddenGroup'
import perfectXWingTryOutAnalyser from './perfectXWing'
import finnedXWingTryOutAnalyser from './finnedXWing'

const tryOutAnalysers = {
    [HINTS_IDS.NAKED_DOUBLE]: nakedDoubleTryOutAnalyser,
    [HINTS_IDS.NAKED_TRIPPLE]: nakedTrippleTryOutAnalyser,
    [HINTS_IDS.HIDDEN_DOUBLE]: hiddenGroupTryOutAnalyser,
    [HINTS_IDS.HIDDEN_TRIPPLE]: hiddenGroupTryOutAnalyser,
    [HINTS_IDS.PERFECT_X_WING]: perfectXWingTryOutAnalyser,
    [HINTS_IDS.FINNED_X_WING]: finnedXWingTryOutAnalyser,
}

export const analyseTryOutInput = ({ hintType, data }) => {
    const handler = tryOutAnalysers[hintType]
    if (handler) {
        return handler(data)
    }
    throw 'invalid type of hint try-out requested for analysing'
}
