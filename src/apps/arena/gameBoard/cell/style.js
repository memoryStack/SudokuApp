import { StyleSheet } from 'react-native'
import { fonts } from '@resources/fonts/font'

export const getStyles = CELL_HEIGHT => StyleSheet.create({
    cell: {
        flex: 1,
    },
    mainNumberText: {
        fontSize: CELL_HEIGHT * 0.8,
        fontFamily: fonts.regular,
        textAlign: 'center',
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
        fontSize: CELL_HEIGHT * 0.3,
        fontFamily: fonts.regular,
    },
})
