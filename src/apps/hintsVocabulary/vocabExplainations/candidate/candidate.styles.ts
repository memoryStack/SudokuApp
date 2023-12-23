import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

export const getStyles = ({ CELL_WIDTH }, theme) => StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    exampleBoardContainer: {
        width: 200,
        height: 200,
        marginVertical: 40,
    },
    highlightedCell: {
        backgroundColor: _get(theme, ['colors', 'smartHints', 'selectedCellBGColor']),
    },

})
