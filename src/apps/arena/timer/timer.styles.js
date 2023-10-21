import get from '@lodash/get'
import { StyleSheet } from 'react-native'

export const getStyles = (_, theme) => StyleSheet.create({
    triangleShape: {
        width: 0,
        height: 0,
        borderWidth: 5,
        marginLeft: 2,
        borderRightWidth: 0,
        borderLeftWidth: 8,
        borderLeftColor: get(theme, ['colors', 'on-surface-variant-low']),
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
    },
    pauseButtonMiddleGap: {
        marginRight: 2,
    },
    rectangleShape: {
        display: 'flex',
        width: 3,
        height: 10,
        backgroundColor: get(theme, ['colors', 'on-surface-variant-low']),
    },
    timeCounter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '20%',
    },
    timerText: {
        color: get(theme, ['colors', 'on-surface-variant-low']),
    },
    pauseTimerIconContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 2,
    },
})
