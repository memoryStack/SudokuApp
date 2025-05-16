import { Platform } from '@utils/classes/platform';
import { consoleLog } from '@utils/util';
import { AppVersionsServiceAdapter } from 'src/interfaces/appVersionsServiceAdapter'

const hostname = "http://52.66.253.10:3000";

const DEFAULT_NO_UPDATE_RESPONSE = {
    features: [],
    mandatory: false,
}

export const AppVersionsAdapter: AppVersionsServiceAdapter = {
    getAppUpdate: async () => {
        try {
            const { version } = Platform.getBuildDetails()
            const response = await fetch(`${hostname}/appUpdate/${version}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })

            if (!response.ok) return DEFAULT_NO_UPDATE_RESPONSE

            const { mandatory, features } = await response.json()
            return { mandatory, features }
        } catch (error) {
            // throw error;
            console.log('@@@@@ error', error)
        }
        return DEFAULT_NO_UPDATE_RESPONSE
    },
}
