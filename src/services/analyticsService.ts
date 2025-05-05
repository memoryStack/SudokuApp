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
                headers: {
                    'Content-Type': 'application/json', // ← Critical header
                    'Accept': 'application/json',       // ← Optional but good practice
                },
                body: JSON.stringify(eventData),
            });
        } catch (error) {
            // throw error;
            console.log('@@@@@ error', error)
        }
    }
}

export default AnalyticsService;
