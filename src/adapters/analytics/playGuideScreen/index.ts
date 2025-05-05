import {
    type PlayGuideAnalyticsHandler, PlayGuideStates
} from "@application/analyticsInterfaces/types";
import { getClient, getEventCommonData } from "../helpers";

const EVENT_NAMES = {
    PLAY_GUIDE_OPENED: 'playGuideOpened',
}

export const PlayGuideAnalyticsHandlers: PlayGuideAnalyticsHandler = {
    sendPlayGuideOpenedEvent: async () => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.PLAY_GUIDE_OPENED, {
            ...commonData,
            status: PlayGuideStates.OPENED
        })
    },
}
