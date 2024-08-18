import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

export const getStyles = (_: unknown, theme) => StyleSheet.create({
    a: {
        color: _get(theme, ['colors', 'primary']),
        textDecorationLine: 'underline',
    }
})
