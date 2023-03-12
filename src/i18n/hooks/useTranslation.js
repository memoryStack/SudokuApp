import { useTranslation as externalUseTranslation } from 'react-i18next'

// just a wrapper around the external dependency
export const useTranslation = () => {
    const result = externalUseTranslation()

    return {
        ...result,
        selectedLanguage: result?.i18n?.language,
    }
}
