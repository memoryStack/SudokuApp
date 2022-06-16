import { HINTS_IDS } from '../constants'

import nakedDoubleTryOutAnalyser from './nakedDouble'
import nakedTrippleTryOutAnalyser from './nakedTripple'
import hiddenGroupTryOutAnalyser from './hiddenGroup'

const tryOutAnalysers = {
    [HINTS_IDS.NAKED_DOUBLE]: nakedDoubleTryOutAnalyser,
    [HINTS_IDS.NAKED_TRIPPLE]: nakedTrippleTryOutAnalyser,
    [HINTS_IDS.HIDDEN_DOUBLE]: hiddenGroupTryOutAnalyser,
    [HINTS_IDS.HIDDEN_TRIPPLE]: hiddenGroupTryOutAnalyser,
}

export const analyseTryOutInput = ({ hintType, data }) => {
    const handler = tryOutAnalysers[hintType]
    if (handler) {
        return handler(data)
    }
    throw 'invalid type of hint try-out requested for analysing'
}
