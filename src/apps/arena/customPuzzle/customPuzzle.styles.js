import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

import { fonts } from '@resources/fonts/font'

export const getStyles = (_, theme, isLight) => StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        paddingTop: 16,
        paddingBottom: 32,
        paddingHorizontal: '3%', // 94% is te grid size
    },
    closeIconContainer: {
        alignSelf: 'flex-end',
        marginBottom: 16,
    },
    closeIcon: {
        color: _get(theme, ['colors', 'on-surface-variant']),
    },
    inputPanelContainer: {
        width: '100%',
        marginVertical: 24,
    },
    playButtonContainer: {
        paddingHorizontal: 24,
        width: '80%',
    },
    // TODO: use it from tokens
    selectedCellBGColor: {
        backgroundColor: _get(theme, ['colors', 'board', 'selectedCellBGColor'])
    },
    mistakeCellBGColor: {
        backgroundColor: _get(theme, ['colors', 'board', 'mistakeCellBGColor']),
    },
    defaultCellBGColor: {
        backgroundColor: _get(theme, ['colors', isLight ? 'surface' : 'surface-container-low']),
    },
    wronglyFilledNumColor: {
        color: _get(theme, ['colors', 'board', 'mistakeCellBGColor']),
    },
    clueNumColor: {
        color: _get(theme, ['colors', 'board', 'clueNumColor'])
    },
})
