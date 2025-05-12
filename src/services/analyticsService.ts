import { Platform } from "@utils/classes/platform";
import { consoleLog } from "@utils/util";

type EventPayload = Record<string, any>;

class AnalyticsService {
    private readonly hostname: string;

    constructor() {
        this.hostname = "http://52.66.253.10:3000";
    }

    async sendEvent(eventName: string, payload: EventPayload = {}): Promise<void> {
        const eventData = {
            event: eventName,
            data: payload,
        };

        try {
            const response = await fetch(`${this.hostname}/api/sendEvent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // ← Critical header
                    'Accept': 'application/json',       // ← Optional but good practice
                    'dev': String(!Platform.isProd()),
                },

                body: JSON.stringify(eventData),
            });
            consoleLog('@@@@@ analytics resp', response)
        } catch (error) {
            // throw error;
            console.log('@@@@@ error', error)
        }
    }
}

export default AnalyticsService;
