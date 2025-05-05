import type {
    HintsVocobularyAnalyticsHandler,
} from "@application/analyticsInterfaces/types";
import { getClient, getEventCommonData } from "../helpers";

const EVENT_NAMES = {
    VOCABULARY_VIEWED: 'vocabularyViewed',
}

export const HintsVocobularyAnalyticsHandlers: HintsVocobularyAnalyticsHandler = {
    sendVocabularyViewEvent: async (data) => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.VOCABULARY_VIEWED, { ...commonData, ...data })
    },
}
