import type {
    ArenaAnalyticsHandler,
} from "@application/analyticsInterfaces/types";
import { getClient, getEventCommonData } from "../helpers";

const EVENT_NAMES = {
    PUZZLE_LIFE_CYCLE: 'puzzleLifeCycle',
    SMART_HINT_VISIBLE: 'smartHintVisible',
    HINT_TRYOUT_USED: 'hintTryoutUsed',
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
}
