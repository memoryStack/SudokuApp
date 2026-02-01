import _map from '@lodash/map'

export const LANGUAGE_KEYS = {
    ENGLISH: 'ENGLISH',
    HINDI: 'HINDI',
    ...(__DEV__ && { JAPANESE: 'JAPANESE' }),
}

export const LANGUAGE_LABELS = {
    ENGLISH: 'English',
    HINDI: 'हिंदी',
    ...(__DEV__ && { JAPANESE: '日本語' }),
}

export const LANGAUGE_OPTIONS = _map(LANGUAGE_KEYS, key => ({
    key,
    label: LANGUAGE_LABELS[key],
}))
