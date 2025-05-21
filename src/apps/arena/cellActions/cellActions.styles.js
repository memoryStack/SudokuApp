import { StyleSheet } from 'react-native'

import get from '@lodash/get'

export const getStyles = (_, theme) => StyleSheet.create({
    cellActionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 20,
        // maxWidth: 10,
    },
    actionContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    actionText: {
        marginTop: 8,
        color: get(theme, ['colors', 'on-surface-variant-low']),
        fontSize: 24
    },
    activeState: {
        color: get(theme, ['colors', 'primary']),
    },
    inactiveState: {
        color: get(theme, ['colors', 'on-surface-variant-low']),
    },
})
