import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

export const getStyles = ({ CELL_WIDTH }, theme) => StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        // alignItems: 'center',
    },
    exampleBoardContainer: {
        marginTop: 24,
        marginBottom: 8,
        marginLeft: -6, // because the Board is taking a lot of space (96% of the screen width)
        alignSelf: 'center',
    },
    highlightedCell: {
        backgroundColor: _get(theme, ['colors', 'smartHints', 'selectedCellBGColor']),
    },
})
