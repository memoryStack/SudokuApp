import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

import { FONT_WEIGHTS } from '@resources/fonts/font'

import smartHintColorSystemReader from '../utils/smartHints/colorSystem.reader'

export const getStyles = (_: unknown, theme: unknown) => {
    return StyleSheet.create({
        selectedCellBGColor: {
            backgroundColor: _get(theme, ['colors', 'board', 'selectedCellBGColor'])
        },
        mistakeCellBGColor: {
            backgroundColor: _get(theme, ['colors', 'board', 'mistakeCellBGColor']),
        },
        sameHouseCellBGColor: {
            backgroundColor: _get(theme, ['colors', 'board', 'sameHouseCellBGColor']),
        },
        diffHouseSameValueBGColor: {
            backgroundColor: _get(theme, ['colors', 'board', 'diffHouseSameValueBGColor']),
        },
        defaultCellBGColor: {
            backgroundColor: _get(theme, ['colors', 'board', 'defaultCellBGColor']),
        },
        smartHintOutOfFocusBGColor: {
            backgroundColor: 'transparent',
        },
        tryOutInputColor: {
            color: smartHintColorSystemReader.tryOutFilledNumberColor(_get(theme, 'colors.smartHints')),
        },
        removableNoteTryOutInputColor: {
            color: smartHintColorSystemReader.removableNoteTryOutNumberInputColor(_get(theme, 'colors.smartHints')),
        },
        wronglyFilledNumColor: {
            color: _get(theme, ['colors', 'board', 'wronglyFilledNumColor']),
        },
        userFilledNumColor: {
            color: _get(theme, ['colors', 'board', 'userFilledNumColor']),
        },
        clueNumColor: {
            color: _get(theme, ['colors', 'board', 'clueNumColor'])
        },
        smartHintAxisText: {
            color: _get(theme, ['colors', 'on-surface']),
            zIndex: 100, // TODO: make a constant with name like max_possible z_index
        },
        smartHintBoardContainer: { zIndex: 1 },
        selectedMainNumberNote: {
            color: _get(theme, ['colors', 'primary']),
            fontWeight: FONT_WEIGHTS.HEAVY,
        },
    })
}
