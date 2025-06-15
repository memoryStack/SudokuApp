import { StyleSheet } from 'react-native'

import get from '@lodash/get'

import { Theme } from 'src/containers/ThemeProvider'

export const getStyles = (_: any, theme: Theme) => StyleSheet.create({
    container: {
        maxHeight: 500,
    },
    featuresContainer: {
        marginLeft: 16,
        alignSelf: 'flex-start',
    },
    featureOptionContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    featuresOptionsGap: {
        marginTop: 12,
    },
    featureLabel: {
        marginLeft: 16,
        color: get(theme, ['colors', 'on-surface']),
    },
})
