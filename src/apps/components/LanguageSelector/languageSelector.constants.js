import _reduce from '@lodash/reduce'

import { LANGUAGE_KEYS } from '../../../i18n/languages'

export const LANGUAGE_OPTION_TEST_ID = _reduce(LANGUAGE_KEYS, (acc, _, key) => {
    acc[key] = `${key}_OPTION_TEST_ID`
    return acc
}, {})

export const SELECTED_OPTION_HIGHLIGHTER_TEST_ID = 'HIGHLIGHTER_TEST_ID'
