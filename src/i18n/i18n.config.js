import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import 'intl-pluralrules'

import { languageDetectorPlugin } from './plugins/languageDetector'
import { LANGUAGE_KEYS } from './languages'

const NAMESPACES = [
    'common',
    'home',
    'levels',
    'arena',
    'playGuide',
    'settings',
    'dialogs',
    'errors',
    'hintsVocabulary',
    'extras',
    'smartHints',
    'tryOutAnalyser',
]

const resources = {
    [LANGUAGE_KEYS.ENGLISH]: {
        common: require('./translations/en/common.json'),
        home: require('./translations/en/home.json'),
        levels: require('./translations/en/levels.json'),
        arena: require('./translations/en/arena.json'),
        playGuide: require('./translations/en/playGuide.json'),
        settings: require('./translations/en/settings.json'),
        dialogs: require('./translations/en/dialogs.json'),
        errors: require('./translations/en/errors.json'),
        hintsVocabulary: require('./translations/en/hintsVocabulary.json'),
        extras: require('./translations/en/extras.json'),
        smartHints: require('./translations/en/smartHints.json'),
        tryOutAnalyser: require('./translations/en/tryOutAnalyser.json'),
    },
    [LANGUAGE_KEYS.HINDI]: {
        common: require('./translations/hi/common.json'),
        home: require('./translations/hi/home.json'),
        levels: require('./translations/hi/levels.json'),
        arena: require('./translations/hi/arena.json'),
        playGuide: require('./translations/hi/playGuide.json'),
        settings: require('./translations/hi/settings.json'),
        dialogs: require('./translations/hi/dialogs.json'),
        errors: require('./translations/hi/errors.json'),
        hintsVocabulary: require('./translations/hi/hintsVocabulary.json'),
        extras: require('./translations/hi/extras.json'),
        smartHints: require('./translations/hi/smartHints.json'),
        tryOutAnalyser: require('./translations/hi/tryOutAnalyser.json'),
    },
}

i18n
    .use(initReactI18next)
    .use(languageDetectorPlugin)
    .init({
        resources,
        ns: NAMESPACES,
        defaultNS: 'common',
        fallbackLng: [LANGUAGE_KEYS.ENGLISH],
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    })

export default i18n
