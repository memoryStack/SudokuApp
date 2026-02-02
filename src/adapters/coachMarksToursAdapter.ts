import type { CustomizeExperienceTooltipState } from '@application/adapterInterfaces/coachMarks'
import { CoachMarksAdapterUIInterface } from 'src/interfaces/coachMarksToursAdapter'

import _map from "@lodash/map"
import { getKey, setKey } from "@utils/storage"
import _get from "@lodash/get"
import _cloneDeep from "@lodash/cloneDeep"
import { COACHMARKS } from '@application/adapterInterfaces/coachMarks'

const COACHMARKS_KEY = 'COACHMARKS'

type HowToGetHintsData = {
    [COACHMARKS.HOW_TO_GET_HINTS]: { shown: boolean }
}

type HintsMenuTooltipShownData = {
    shownCount: number
}

type CustomizeExperienceTooltipPersistedData = CustomizeExperienceTooltipState

type CustomizeExperiencePreviewTooltipShownData = HintsMenuTooltipShownData

const shownCoachmarks: Partial<Record<COACHMARKS, boolean>> = {}

const DEFAULT_CUSTOMIZE_EXPERIENCE_TOOLTIP_STATE: CustomizeExperienceTooltipState = {
    knownTooltipIds: []
}

export const coachMarksAdapter: CoachMarksAdapterUIInterface = {
    setUserLearnedToGetHints: async () => {
        const existingData = await getKey(COACHMARKS_KEY) as HowToGetHintsData
        const finalData = existingData || {}
        finalData[COACHMARKS.HOW_TO_GET_HINTS] = { shown: true }
        await setKey(COACHMARKS_KEY, finalData)
    },
    getUserLearnedToGetHints: async () => {
        const coachmarksData = (await getKey(COACHMARKS_KEY) || {}) as HowToGetHintsData
        return coachmarksData[COACHMARKS.HOW_TO_GET_HINTS]?.shown ?? false
    },
    increaseHintsMenuTooltipShownCount: async () => {
        const existingData = await getKey(COACHMARKS.HINTS_MENU_TOOLTIP)
        const finalData = (existingData || { shownCount: 0 }) as HintsMenuTooltipShownData
        finalData.shownCount += 1
        await setKey(COACHMARKS.HINTS_MENU_TOOLTIP, finalData)
    },
    getHintsMenuTooltipCount: async () => {
        const existingData = await getKey(COACHMARKS.HINTS_MENU_TOOLTIP)
        const finalData = (existingData || { shownCount: 0 }) as HintsMenuTooltipShownData
        return finalData.shownCount
    },
    getCustomizeExperienceTooltipState: async () => {
        const existing = await getKey(COACHMARKS.CUSTOMIZE_EXPERIENCE_TOOLTIP) as CustomizeExperienceTooltipPersistedData | null | undefined
        if (!existing || !Array.isArray(existing.knownTooltipIds)) {
            return { ...DEFAULT_CUSTOMIZE_EXPERIENCE_TOOLTIP_STATE }
        }
        return { knownTooltipIds: [...existing.knownTooltipIds] }
    },
    markCustomizeExperienceTooltipKnown: async (tooltipId: string) => {
        const existing = await coachMarksAdapter.getCustomizeExperienceTooltipState()
        if (existing.knownTooltipIds.includes(tooltipId)) return
        const next = { knownTooltipIds: [...existing.knownTooltipIds, tooltipId] }
        await setKey(COACHMARKS.CUSTOMIZE_EXPERIENCE_TOOLTIP, next)
    },
    markCustomizeExperienceTooltipShownInSession: () => {
        shownCoachmarks[COACHMARKS.CUSTOMIZE_EXPERIENCE_TOOLTIP] = true
    },
    isCoachmarkShownInSession: (coachmark: COACHMARKS) => {
        return Boolean(shownCoachmarks[coachmark])
    },
    getCustomizeExperiencePreviewTooltipShownCount: async () => {
        const existingData = await getKey(COACHMARKS.GAME_SETTINGS_PREVIEW_TOOLTIP)
        const finalData = (existingData || { shownCount: 0 }) as CustomizeExperiencePreviewTooltipShownData
        return finalData.shownCount
    },
    increaseCustomizeExperiencePreviewTooltipShownCount: async () => {
        const existingData = await getKey(COACHMARKS.GAME_SETTINGS_PREVIEW_TOOLTIP)
        const finalData = (existingData || { shownCount: 0 }) as CustomizeExperienceTooltipShownData
        finalData.shownCount += 1
        await setKey(COACHMARKS.GAME_SETTINGS_PREVIEW_TOOLTIP, finalData)
    },
}
