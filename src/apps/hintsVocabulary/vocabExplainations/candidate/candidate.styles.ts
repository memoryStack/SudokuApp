import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

import { Theme } from 'src/containers/ThemeProvider'

export const getStyles = (_: any, theme: Theme) => StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        // alignItems: 'center',
    },
    board: {
        backgroundColor: _get(theme, ['colors', 'surface-container'])
    },
    exampleBoardContainer: {
        width: 200,
        height: 200,
        marginVertical: 40,
        alignSelf: 'center',
    },
    highlightedCell: {
        backgroundColor: _get(theme, ['colors', 'smartHints', 'selectedCellBGColor']),
    }
})
