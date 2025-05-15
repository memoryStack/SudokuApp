import { CoachMarksAdapterUIInterface } from 'src/interfaces/coachMarksToursAdapter'

import _map from "@lodash/map"
import { getKey, setKey } from "@utils/storage"
import _get from "@lodash/get"
import _cloneDeep from "@lodash/cloneDeep"
import { COACHMARKS } from '@application/adapterInterfaces/coachMarks'

export const coachMarksAdapter: CoachMarksAdapterUIInterface = {
    setUserLearnedToGetHints: async () => {
        const existingData = await getKey('COACHMARKS')
        const finalData = existingData || {}
        finalData[COACHMARKS.HOW_TO_GET_HINTS] = { shown: true }
        await setKey('COACHMARKS', finalData)
    },
    getUserLearnedToGetHints: async () => {
        const coachmarksData = await getKey('COACHMARKS') || {}
        return coachmarksData[COACHMARKS.HOW_TO_GET_HINTS]?.shown ?? false
    }
}
