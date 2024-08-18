import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

export const getStyles = (_: unknown, theme) => StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    },
    resetParagraphMarginTop: {
        marginTop: -16
    },
    intersectionCell: {
        backgroundColor: _get(theme, ['colors', 'smartHints', 'selectedCellBGColor']),
    },
    exampleBoardContainer: {
        marginTop: 16,
        marginLeft: -12
    }
})
