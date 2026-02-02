import type { CommonAnalyticsHandlers } from '@application/adapterInterfaces/analytics'
import { getClient, getEventCommonData } from '../helpers'

const EVENT_NAMES = {
    LANGUAGE_SAVED: 'languageSaved',
}

export const CommonAnalyticsHandler: CommonAnalyticsHandlers = {
    sendLanguageSavedEvent: async (data) => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.LANGUAGE_SAVED, { ...commonData, ...data })
    },
}
