import { StyleSheet } from 'react-native'
export const Styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 16,
        marginTop: 8,
    },
    tickerBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -4,
        right: -4,
        width: 16,
        height: 16,
        borderRadius: 100,
        backgroundColor: 'rgb(49, 90, 163)',
    },
    tickerText: {
        fontSize: 14,
        color: 'white',
    },
})
