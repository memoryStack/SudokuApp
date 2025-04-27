import { userDetailsAdapter } from "@adapters/userDetails";
import type {
    ArenaAnalyticsHandler,
} from "@application/analyticsInterfaces/types";
import AnalyticsService from "src/services/analyticsService";

const getUserId = (() => {
    let userId = null
    return async () => {
        if (userId) return userId
        userId = await userDetailsAdapter.getUserId()
        return userId
    }
})()

const getClient = (() => {
    let client
    return () => {
        client = new AnalyticsService()
        return client
    }
})()

const EVENT_NAMES = {
    PUZZLE_LIFE_CYCLE: 'puzzleLifeCycle',
    SMART_HINT_VISIBLE: 'smartHintVisible',
}

const getEventCommonData = async () => {
    return {
        userId: await getUserId(),
        time: new Date().toString()
    }
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
}
