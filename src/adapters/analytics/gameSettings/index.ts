import type {
    GameSettingsAnalyticsHandlers,
} from "@application/adapterInterfaces/analytics";
import { getClient, getEventCommonData } from "../helpers";

const EVENT_NAMES = {
    SCREEN_VISITED: 'gameSettingsScreenVisited',
    SETTINGS_OPTION_CHANGED: 'settingsOptionChanged',
}

export const GameSettingsAnalyticsHandler: GameSettingsAnalyticsHandlers = {
    sendScreenVisitedEvent: async () => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.SCREEN_VISITED, { ...commonData })
    },
    sendOnChangeOptionEvent: async (data) => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.SETTINGS_OPTION_CHANGED, { ...commonData, ...data })
    }
}
