import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import 'intl-pluralrules'

import { english, hindi } from './translations'
import { languageDetectorPlugin } from './plugins/languageDetector'
import { LANGUAGE_KEYS } from './languages'

const resources = {
    [LANGUAGE_KEYS.ENGLISH]: {
        translation: english,
    },
    [LANGUAGE_KEYS.HINDI]: {
        translation: hindi,
    },
}

i18n
    .use(initReactI18next)
    .use(languageDetectorPlugin)
    .init({
        resources,
        fallbackLng: [LANGUAGE_KEYS.ENGLISH],
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    })

export default i18n
