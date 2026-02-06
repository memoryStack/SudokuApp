import { StyleSheet } from 'react-native'

import get from '@lodash/get'

export const getStyles = (_, theme) => StyleSheet.create({
    container: {
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    rulesContainer: {
        paddingHorizontal: 16,
    },
    puzzleSolutionContainer: {
        marginTop: 24,
        paddingBottom: 40,
    },
    solutionTitle: {
        color: get(theme, ['colors', 'on-surface']),
        marginBottom: 16,
        paddingHorizontal: 16
    }
})
