type EventPayload = Record<string, any>;

class AnalyticsService {
    private readonly hostname: string;

    constructor() {
        this.hostname = "http://52.66.253.10:3000";
    }

    async sendEvent(eventName: string, payload: EventPayload = {}): Promise<void> {
        const eventData = {
            event: eventName,
            ...payload,
        };

        console.log('@@@@@ event data', eventData)

        try {
            const response = await fetch(`${this.hostname}/api/sendEvent`, {
                method: 'POST',
                body: JSON.stringify(eventData),
            });
        } catch (error) {
            // throw error;
        }
    }
}

export default AnalyticsService;
