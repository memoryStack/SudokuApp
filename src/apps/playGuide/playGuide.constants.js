import { FONT_WEIGHTS } from '@resources/fonts/font'

import { HOUSE_TYPE } from '@domain/board/board.constants'

import { HOUSES_COLORS } from './boardData/cellsHighlightData'

export const getRulesTextConfig = (t) => [
    {
        label: t('playGuide:rules.part1'),
        key: 'part_1',
    },
    {
        label: t('playGuide:rules.rows'),
        styles: {
            color: HOUSES_COLORS.HOUSE_TEXT[HOUSE_TYPE.ROW],
            fontWeight: FONT_WEIGHTS.BOLD,
        },
        key: 'part_2',
    },
    {
        label: t('playGuide:rules.part3'),
        key: 'part_3',
    },
    {
        label: t('playGuide:rules.columns'),
        styles: {
            color: HOUSES_COLORS.HOUSE_TEXT[HOUSE_TYPE.COL],
            fontWeight: FONT_WEIGHTS.BOLD,
        },
        key: 'part_4',
    },
    {
        label: t('playGuide:rules.part5'),
        key: 'part_5',
    },
    {
        label: t('playGuide:rules.blocks'),
        styles: {
            color: HOUSES_COLORS.HOUSE_TEXT[HOUSE_TYPE.BLOCK],
            fontWeight: FONT_WEIGHTS.BOLD,
        },
        key: 'part_6',
    },
    {
        label: t('playGuide:rules.part7'),
        key: 'part_7',
    },
    {
        label: t('playGuide:rules.part8'),
        key: 'part_8',
    },
]

export const getSolutionTitle = (t) => t('playGuide:solutionTitle')

export const PUZZLE = {
    UNSOLVED: '590803001000700002740002060000036010206010908010950000020300074300004000100605089',
    SOLVED: '592863741863741592741592863958236417236417958417958236625389174389174625174625389',
}
