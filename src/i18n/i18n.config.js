import i18n from 'i18next'
import ICU from "i18next-icu";
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
    'screenTitles',
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
        screenTitles: require('./translations/en/screenTitles.json'),
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
        screenTitles: require('./translations/hi/screenTitles.json'),
        hintsVocabulary: require('./translations/hi/hintsVocabulary.json'),
        extras: require('./translations/hi/extras.json'),
        smartHints: require('./translations/hi/smartHints.json'),
        tryOutAnalyser: require('./translations/hi/tryOutAnalyser.json'),
    },
    ...(LANGUAGE_KEYS.JAPANESE && {
        [LANGUAGE_KEYS.JAPANESE]: {
            common: require('./translations/ja/common.json'),
            home: require('./translations/ja/home.json'),
            levels: require('./translations/ja/levels.json'),
            arena: require('./translations/ja/arena.json'),
            playGuide: require('./translations/ja/playGuide.json'),
            settings: require('./translations/ja/settings.json'),
            dialogs: require('./translations/ja/dialogs.json'),
            errors: require('./translations/ja/errors.json'),
            screenTitles: require('./translations/ja/screenTitles.json'),
            hintsVocabulary: require('./translations/ja/hintsVocabulary.json'),
            extras: require('./translations/ja/extras.json'),
            smartHints: require('./translations/ja/smartHints.json'),
            tryOutAnalyser: require('./translations/ja/tryOutAnalyser.json'),
        },
    }),
}

i18n
    .use(initReactI18next)
    .use(languageDetectorPlugin)
    .use(ICU)
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
