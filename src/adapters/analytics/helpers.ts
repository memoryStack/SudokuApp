import { userDetailsAdapter } from "@adapters/userDetails";
import { Platform } from "@utils/classes/platform";
import AnalyticsService from "src/services/analyticsService";

const getUserId = (() => {
    let userId = null
    return async () => {
        if (userId) return userId
        userId = await userDetailsAdapter.getUserId()
        return userId
    }
})()

export const getClient = (() => {
    let client
    return () => {
        client = new AnalyticsService()
        return client
    }
})()

export const getEventCommonData = async () => {
    return {
        userId: await getUserId(),
        time: new Date().toString(),
        build: Platform.getBuildDetails(),
    }
}
