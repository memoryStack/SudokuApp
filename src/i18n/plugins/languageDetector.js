import { getKey, setKey } from '@utils/storage'
import { consoleLog } from '@utils/util'
import { SELECTED_LANGUAGE_STORAGE_KEY } from '../constants'

export const languageDetectorPlugin = {
    type: 'languageDetector',
    async: true,
    init: () => { },
    async detect(callback) {
        try {
            callback(await getKey(SELECTED_LANGUAGE_STORAGE_KEY))
        } catch (error) {
            consoleLog('@@@@@@@ error reading language', error)
        }
    },
    async cacheUserLanguage(language) {
        try {
            await setKey(SELECTED_LANGUAGE_STORAGE_KEY, language)
        } catch (error) {
            consoleLog('@@@@@@@ error saving changed language', error)
        }
    },
}
