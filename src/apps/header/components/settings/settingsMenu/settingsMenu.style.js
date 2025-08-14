import get from '@lodash/get'
import { StyleSheet } from 'react-native'

export const getStyles = (_, theme) => StyleSheet.create({
    menuContainer: {
        padding: 16,
        backgroundColor: 'white'
    },
    menuItemContainer: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    menuItemText: {
        color: get(theme, ['colors', 'on-surface']),
    },
    icon: {
        color: get(theme, ['colors', 'on-surface-variant']),
    },
    tooltipContainer: {
        width: 250,
        left: -120
    },
    tooltipText: {
        padding: 8,
        color: 'white'
    }
})
