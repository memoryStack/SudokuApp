import type {
    ArenaAnalyticsHandler,
} from "@application/adapterInterfaces/analytics";
import { getClient, getEventCommonData } from "../helpers";

const EVENT_NAMES = {
    PUZZLE_LIFE_CYCLE: 'puzzleLifeCycle',
    SMART_HINT_VISIBLE: 'smartHintVisible',
    HINT_TRYOUT_USED: 'hintTryoutUsed',
    PENCIL_CLICK: 'pencilClick',
    FAST_PENCIL_CLICK: 'fastPencilClick',
    NO_HINTS_FOUND: 'noHintsFound',
    UNDO_CLICK: 'undoClick',
    HOW_TO_GET_HINTS_COACHMARK_VISIBLE: 'howToGetHintsCoachmarkVisible',
    HOW_TO_GET_HINTS_COACHMARK_STEP_CHANGE: 'howToGetHintsCoachmarkStepChange',
    HOW_TO_GET_HINTS_COACHMARK_COMPELTED: 'howToGetHintsCoachmarkCompleted',
    NEED_HINT_SUGGESTION_CONFIRM: 'needHintSuggestionConfirm',
    DND_BY_HINT_SUGGESTION: 'dndByHintSuggestion',
    HINTS_MENU_TOOLTIP_SHOWN: 'hintsMenuTooltipShown'
}

export const ArenaAnalyticsHandlers: ArenaAnalyticsHandler = {
    sendPuzzleLifeCycleEvent: async (data) => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.PUZZLE_LIFE_CYCLE, { ...commonData, ...data })
    },
    sendSmartHintVisibleEvent: async (data) => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.SMART_HINT_VISIBLE, { ...commonData, ...data })
    },
    sendHintTryoutUsedEvent: async (data) => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.HINT_TRYOUT_USED, { ...commonData, ...data })
    },
    sendPencilClickEvent: async (data) => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.PENCIL_CLICK, { ...commonData, ...data })
    },
    sendFastPencilClickEvent: async () => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.FAST_PENCIL_CLICK, { ...commonData })
    },
    sendNoHintsFoundEvent: async (data) => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.NO_HINTS_FOUND, { ...commonData, puzzle: data })
    },
    sendUndoClickEvent: async () => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.UNDO_CLICK, { ...commonData })
    },
    sendHowToGetHintsCoachmarkVisibleEvent: async () => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.HOW_TO_GET_HINTS_COACHMARK_VISIBLE, { ...commonData })
    },
    sendHowToGetHintsCoachmarkStepChangeEvent: async (data) => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.HOW_TO_GET_HINTS_COACHMARK_STEP_CHANGE, { ...commonData, step: data })
    },
    sendHowToGetHintsCoachmarkCompletedEvent: async () => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.HOW_TO_GET_HINTS_COACHMARK_COMPELTED, { ...commonData })
    },
    sendNeedHintSuggestionConfirmEvent: async () => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.NEED_HINT_SUGGESTION_CONFIRM, { ...commonData })
    },
    sendDNDByHintSuggestionEvent: async () => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.DND_BY_HINT_SUGGESTION, { ...commonData })
    },
    sendHintsMenuTooltipShownEvent: async (data) => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.HINTS_MENU_TOOLTIP_SHOWN, { ...commonData, ...data })
    },
}
