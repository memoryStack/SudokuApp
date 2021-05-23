
import { StyleSheet } from 'react-native'
export const Styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '94%',
        marginBottom: 4,
    },
    triangleShape: {
        width: 0,
        height: 0,
        borderWidth: 5,
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
    textStyles: {
        fontSize: 14,
    },
    timeCounter: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    pauseTimerIconContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
})
