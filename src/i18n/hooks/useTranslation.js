import { useTranslation as externalUseTranslation } from 'react-i18next'

// just a wrapper around the external dependency
export const useTranslation = () => externalUseTranslation()
