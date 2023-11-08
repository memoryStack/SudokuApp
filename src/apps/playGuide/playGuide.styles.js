import { StyleSheet } from 'react-native'

import get from '@lodash/get'

export const getStyles = (_, theme) => StyleSheet.create({
    container: {
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    puzzleSolutionContainer: {
        paddingBottom: 40,
    },
    ruleText: {
        padding: 16,
        color: get(theme, ['colors', 'on-surface']),
    },
    axisText: {
        color: get(theme, ['colors', 'on-surface']),
    },
})
