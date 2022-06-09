import { HINTS_IDS } from '../constants'

import nakedGroupTryOutAnalyser from './nakedGroup'

const tryOutAnalysers = {
    [HINTS_IDS.NAKED_DOUBLE]: nakedGroupTryOutAnalyser,
    [HINTS_IDS.NAKED_TRIPPLE]: nakedGroupTryOutAnalyser,
}

export const analyseTryOutInput = ({ hintType, data }) => {
    const handler = tryOutAnalysers[hintType]
    if (handler) {
        return handler(data)
    }
    throw 'invalid type of hint try-out requested for analysing'
}
