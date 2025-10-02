import { StyleSheet } from 'react-native'

import get from '@lodash/get'

export const getStyles = (_, theme) => StyleSheet.create({
    cellActionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        width: '100%',
        marginTop: 20,
    },
    actionContainer: {
        display: 'flex',
        alignItems: 'center',
        flex: 1
    },
    actionText: {
        marginTop: 8,
        color: get(theme, ['colors', 'on-surface-variant-low']),
        textAlign: 'center',
        lineHeight: 16
    },
    activeState: {
        color: get(theme, ['colors', 'primary']),
    },
    inactiveState: {
        color: get(theme, ['colors', 'on-surface-variant-low']),
    },
})
