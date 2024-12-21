import { StyleSheet } from 'react-native'
import _get from '@lodash/get'
import { FONT_FAMILIES, FONT_WEIGHTS } from '@resources/fonts/font'

export const getStyles = ({ CELL_HEIGHT }, theme) => StyleSheet.create({
    cell: {
        display: 'flex',
        height: '100%',
        width: '100%',
    },
    notesRow: {
        flex: 1,
        flexDirection: 'row',
    },
    mainNumberText: {
        width: '100%',
        height: '100%',
        fontSize: CELL_HEIGHT * 0.8,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    noteContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noteText: {
        color: _get(theme, ['colors', 'on-surface-variant']),
        fontSize: CELL_HEIGHT * 0.33,
        lineHeight: CELL_HEIGHT * 0.33,
        fontWeight: FONT_WEIGHTS.REGULAR,
        fontFamily: FONT_FAMILIES.WITHOUT_ASCENDER_DESCENDER,
    },
    noteTextBold: {
        fontSize: CELL_HEIGHT * 0.36,
        lineHeight: CELL_HEIGHT * 0.36,
    }
})
