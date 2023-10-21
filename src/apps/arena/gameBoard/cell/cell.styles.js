import { StyleSheet } from 'react-native'
import _get from '@lodash/get'

export const getStyles = ({ CELL_HEIGHT }, theme) => StyleSheet.create({
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
        color: _get(theme, ['colors', 'on-surface-variant']),
        fontSize: CELL_HEIGHT * 0.3,
    },
    selectedMainNumberNoteContainer: {
        backgroundColor: _get(theme, ['colors', 'primary-container']),
    },
})
