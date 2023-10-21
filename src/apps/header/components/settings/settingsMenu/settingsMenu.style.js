import get from '@lodash/get'
import { StyleSheet } from 'react-native'

export const getStyles = (_, theme) => StyleSheet.create({
    menuContainer: {
        display: 'flex',
        borderRadius: 4,
        position: 'absolute',
        right: 8,
        top: 40,
        elevation: 10,
        backgroundColor: get(theme, ['colors', 'surface-container-low']),
        paddingHorizontal: 16,
    },
    menuItemContainer: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    menuItemText: {
        color: get(theme, ['colors', 'on-surface']),
    },
})
