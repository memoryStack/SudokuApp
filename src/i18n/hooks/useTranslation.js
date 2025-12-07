import { useTranslation as externalUseTranslation } from 'react-i18next'

import { LANGUAGE_KEYS } from '../languages'

// just a wrapper around the external dependency
export const useTranslation = (...args) => {
    const result = externalUseTranslation(...args)

    return {
        ...result,
        selectedLanguage: result?.i18n?.language || LANGUAGE_KEYS.ENGLISH,
    }
}
