import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

import { FONT_WEIGHTS } from '@resources/fonts/font'

import { hexToRGBA } from '../../utils/util'

export const getStyles = ({ CELL_WIDTH }, theme) => StyleSheet.create({
    container: {
        backgroundColor: _get(theme, ['colors', 'surface']),
    },
    viewContainer: {
        paddingTop: 200,
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    gameDisplayName: {
        textAlign: 'center',
        fontWeight: FONT_WEIGHTS.BOLD,
        color: _get(theme, ['colors', 'on-primary-container']),
    },
    startGameButtonContainer: {
        marginTop: '20%',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    sudokuTextContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        marginTop: '5%',
        paddingHorizontal: 16,
    },
    sudokuLetterText: {
        width: CELL_WIDTH * 1.3,
        height: CELL_WIDTH * 1.3,
        backgroundColor: hexToRGBA('#d5e5f6', 60),
        borderRadius: 12,
        textAlign: 'center',
        color: 'rgb(49, 90, 163)',
    },
    appIcon: {
        width: 100,
        height: 100,
        marginTop: '30%',
    },
    playButtonContainer: {
        width: '80%',
        marginTop: '20%',
    },
    playButtonText: {
        color: 'rgb(49, 90, 163)',
        fontSize: 24,
    },
    gameRulesCTA: {
        marginTop: 16,
        width: '80%',
    },
})
