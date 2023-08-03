import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    triangleShape: {
        width: 0,
        height: 0,
        borderWidth: 5,
        marginLeft: 2,
        borderRightWidth: 0,
        borderLeftWidth: 8,
        borderLeftColor: 'rgba(0, 0, 0, .5)',
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
        backgroundColor: 'rgba(0, 0, 0, .5)',
    },
    timeCounter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '20%',
    },
    pauseTimerIconContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 2,
    },
})
