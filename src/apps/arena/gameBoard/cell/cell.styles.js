import { StyleSheet } from 'react-native'

export const getStyles = () => StyleSheet.create({
    cell: {
        flex: 1,
    },
    notesRow: {
        flex: 1,
        flexDirection: 'row',
    },
    noteContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noteText: {
        color: 'rgba(0, 0, 0, .8)',
        textAlign: 'center',
        lineHeight: 13.5,
    },
})
