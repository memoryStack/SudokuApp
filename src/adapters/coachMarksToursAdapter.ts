import { CoachMarksAdapterUIInterface } from 'src/interfaces/coachMarksToursAdapter'

import _map from "@lodash/map"
import { getKey, setKey } from "@utils/storage"
import _get from "@lodash/get"
import _cloneDeep from "@lodash/cloneDeep"
import { COACHMARKS } from '@application/adapterInterfaces/coachMarks'

const COACHMARKS_KEY = 'COACHMARKS'

export const coachMarksAdapter: CoachMarksAdapterUIInterface = {
    setUserLearnedToGetHints: async () => {
        const existingData = await getKey(COACHMARKS_KEY)
        const finalData = existingData || {}
        finalData[COACHMARKS.HOW_TO_GET_HINTS] = { shown: true }
        await setKey(COACHMARKS_KEY, finalData)
    },
    getUserLearnedToGetHints: async () => {
        const coachmarksData = await getKey(COACHMARKS_KEY) || {}
        return coachmarksData[COACHMARKS.HOW_TO_GET_HINTS]?.shown ?? false
    },
    increaseHintsMenuTooltipShownCount: async () => {
        const existingData = await getKey(COACHMARKS.HINTS_MENU_TOOLTIP)
        const finalData = (existingData || { shownCount: 0 }) as { shownCount: number }
        finalData.shownCount += 1
        await setKey(COACHMARKS.HINTS_MENU_TOOLTIP, finalData)
    },
    getHintsMenuTooltipCount: async () => {
        const existingData = await getKey(COACHMARKS.HINTS_MENU_TOOLTIP)
        const finalData = (existingData || { shownCount: 0 }) as { shownCount: number }
        return finalData.shownCount
    },
}
