import { StyleSheet } from 'react-native'

export const INACTIVE_ICON_FILL = 'rgb(127, 127, 127)'
export const Styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    actionContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    actionText: {
        fontSize: 16,
        marginTop: 8,
    },
    hintsTickerBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -4,
        right: -4,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: 'rgb(49, 90, 163)',
    },
    hintsTickerText: {
        fontSize: 12,
        color: 'white',
    },
})
