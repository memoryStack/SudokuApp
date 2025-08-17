import type {
    GameSettingsAnalyticsHandlers,
} from "@application/adapterInterfaces/analytics";
import { getClient, getEventCommonData } from "../helpers";

const EVENT_NAMES = {
    SCREEN_VISITED: 'gameSettingsScreenVisited',
    SETTINGS_OPTION_CHANGED: 'settingsOptionChanged',
    PREVIEW_STATE_CHANGED: 'previewStateChanged'
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
    },
    sendPreviewPressEvent: async (data) => {
        const client = getClient()
        const commonData = await getEventCommonData()
        return client.sendEvent(EVENT_NAMES.PREVIEW_STATE_CHANGED, { ...commonData, ...data })
    }
}
