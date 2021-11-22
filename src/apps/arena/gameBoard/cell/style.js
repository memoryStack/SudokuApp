import { StyleSheet } from 'react-native'
import { CELL_HEIGHT } from '../dimensions'
import { fonts } from '../../../../resources/fonts/font'

export const Styles = StyleSheet.create({
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
