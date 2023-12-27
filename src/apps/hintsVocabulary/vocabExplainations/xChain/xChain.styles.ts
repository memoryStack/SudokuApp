import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

export const getStyles = (_: unknown, theme) => StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    },
    exampleBoardContainer: {
        marginTop: 16,
        marginBottom: 8,
        marginLeft: -6, // because the Board is taking a lot of space (96% of the screen width)
        alignSelf: 'center',
    },
    truncatedBoardContainer: {
        width: 140,
        height: 140,
    },
    hiddenSingleHostCell: {
        backgroundColor: _get(theme, ['colors', 'smartHints', 'selectedCellBGColor']),
    },
    nakedDoubleHostCell: {
        backgroundColor: _get(theme, ['colors', 'primary-container']),
    },
    hostHouseCell: {
        backgroundColor: _get(theme, ['colors', 'surface-container-high']),
    },
    waysToFillNDCellsContainer: {
        marginTop: 24,
    },
    invalidExamplesBoardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    removableNotesExampleContainer: {
        marginTop: 16,
    },
    removableNotesBoardContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
    },
})
