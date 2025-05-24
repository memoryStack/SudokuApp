import type {
    HomeAnalyticsHandlers as HomeAnalyticsHandlersInterface,
} from "@application/adapterInterfaces/analytics";
import { getClient, getEventCommonData } from "../helpers";

const EVENT_NAMES = {
    UPDATE_CANCELLED: 'updateCancelled',
    UPDATE_CONFIRMED: 'updateConfirmed',
}

export const HomeAnalyticsHandlers: HomeAnalyticsHandlersInterface = {
    sendUpdateCancelledEvent: async () => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.UPDATE_CANCELLED, { ...commonData })
    },
    sendUpdateConfirmedEvent: async () => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.UPDATE_CONFIRMED, { ...commonData })
    },
}
