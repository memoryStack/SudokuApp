import { StyleSheet } from 'react-native'

import _get from '@lodash/get'
import { Theme } from 'src/containers/ThemeProvider'

export const getStyles = (_: unknown, theme: Theme) => StyleSheet.create({
    a: {
        color: _get(theme, ['colors', 'primary']),
        textDecorationLine: 'underline',
    }
})
