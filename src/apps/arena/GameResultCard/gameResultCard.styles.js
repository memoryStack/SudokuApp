import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        width: '70%',
    },
    congratsText: {
        marginVertical: 8,
        fontWeight: '500',
    },
    statsContainer: {
        marginTop: 20,
        width: '100%',
    },
    statContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 2,
    },
    gameUnsolvedMsg: {
        textAlign: 'center',
    },
    newGameButtonContainer: {
        marginTop: 16,
        width: '80%',
    },
    timeStatContainer: {
        flexDirection: 'row',
    },
})
