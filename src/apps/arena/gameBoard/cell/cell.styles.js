import { StyleSheet } from 'react-native'

export const getStyles = CELL_HEIGHT => StyleSheet.create({
    cell: {
        flex: 1,
    },
    notesRow: {
        flex: 1,
        flexDirection: 'row',
    },
    mainNumberText: {
        fontSize: CELL_HEIGHT * 0.8,
    },
    noteContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noteText: {
        color: 'rgba(0, 0, 0, .8)',
        fontSize: CELL_HEIGHT * 0.3,
    },
})
