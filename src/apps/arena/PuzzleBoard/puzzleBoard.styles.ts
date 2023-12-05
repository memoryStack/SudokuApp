import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

import { FONT_WEIGHTS } from '@resources/fonts/font'
import { HC_OVERLAY_BG_COLOR } from '../../components/BottomDragger'

import smartHintColorSystemReader from '../utils/smartHints/colorSystem.reader'

export const getStyles = (_: unknown, theme: unknown) => StyleSheet.create({
    selectedCellBGColor: {
        backgroundColor: 'rgb(255, 245, 187)',
    },
    sameHouseSameValueBGColor: {
        backgroundColor: _get(theme, ['colors', 'error-container']),
    },
    sameHouseCellBGColor: {
        backgroundColor: _get(theme, ['colors', 'surface-container-high']),
    },
    diffHouseSameValueBGColor: {
        backgroundColor: _get(theme, ['colors', 'primary-container']),
    },
    smartHintOutOfFocusBGColor: {
        backgroundColor: HC_OVERLAY_BG_COLOR,
    },
    defaultCellBGColor: {
        backgroundColor: 'white',
    },
    tryOutInputColor: {
        color: smartHintColorSystemReader.tryOutFilledNumberColor(_get(theme, 'colors.smartHints')),
    },
    removableNoteTryOutInputColor: {
        color: smartHintColorSystemReader.removableNoteTryOutNumberInputColor(_get(theme, 'colors.smartHints')),
    },
    wronglyFilledNumColor: {
        color: _get(theme, ['colors', 'on-error-container']),
    },

    userFilledNumColor: {
        color: _get(theme, ['colors', 'primary']),
    },
    clueNumColor: {
        color: 'rgb(12, 25, 22)',
    },
    smartHintAxisText: {
        color: 'white',
        zIndex: 100, // TODO: make a constant with name like max_possible z_index
    },
    smartHintBoardContainer: { zIndex: 1 },
    selectedMainNumberNote: {
        color: _get(theme, ['colors', 'primary']),
        fontWeight: FONT_WEIGHTS.HEAVY,
    },
})
