import _map from 'lodash/src/utils/map'

export const LANGUAGE_KEYS = {
    ENGLISH: 'ENGLISH',
    HINDI: 'HINDI',
}

export const LANGUAGE_LABELS = {
    ENGLISH: 'English',
    HINDI: 'हिंदी',
}

export const DEFAULT_SELECTED_LANGUAGE = LANGUAGE_KEYS.ENGLISH

export const LANGAUGE_OPTIONS = _map(LANGUAGE_KEYS, key => ({
    key,
    label: LANGUAGE_LABELS[key],
}))
