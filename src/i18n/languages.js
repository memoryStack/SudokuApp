import _map from '@lodash/map'

export const LANGUAGE_KEYS = {
    ENGLISH: 'ENGLISH',
    HINDI: 'HINDI',
}

export const LANGUAGE_LABELS = {
    ENGLISH: 'English',
    HINDI: 'हिंदी',
}

export const LANGAUGE_OPTIONS = _map(LANGUAGE_KEYS, key => ({
    key,
    label: LANGUAGE_LABELS[key],
}))
