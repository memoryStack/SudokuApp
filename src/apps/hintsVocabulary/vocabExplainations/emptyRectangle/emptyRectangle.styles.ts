import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

import { Theme } from 'src/containers/ThemeProvider'

export const getStyles = (_: unknown, theme: Theme) => StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    },
    paragraphMarginTop: {
        marginTop: 16
    },
    intersectionCell: {
        backgroundColor: _get(theme, ['colors', 'smartHints', 'selectedCellBGColor']),
    },
    exampleBoardContainer: {
        marginTop: 16,
        marginLeft: -12
    }
})
