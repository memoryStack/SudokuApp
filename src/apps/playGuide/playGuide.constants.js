import { FONT_WEIGHTS } from '@resources/fonts/font'

import { HOUSE_TYPE } from '../arena/utils/smartHints/constants'

import { HOUSES_COLORS } from './boardData/cellsHighlightData'

export const RULES_TEXT_CONFIG = [
    {
        label: 'A sudoku puzzle begins with a grid in which some of the numbers(known as clues) are'
            + ' already filled. Notice above.\n\nA puzzle is completed when each number from 1 to 9 appears only once'
            + ' in each of the 9 ',
        key: 'part_1',
    },
    {
        label: 'rows',
        styles: {
            color: HOUSES_COLORS.HOUSE_TEXT[HOUSE_TYPE.ROW],
            fontWeight: FONT_WEIGHTS.BOLD,
        },
        key: 'part_2',
    },
    {
        label: ', ',
        key: 'part_3',
    },
    {
        label: 'columns',
        styles: {
            color: HOUSES_COLORS.HOUSE_TEXT[HOUSE_TYPE.COL],
            fontWeight: FONT_WEIGHTS.BOLD,
        },
        key: 'part_4',
    },
    {
        label: ', and ',
        key: 'part_5',
    },
    {
        label: 'blocks',
        styles: {
            color: HOUSES_COLORS.HOUSE_TEXT[HOUSE_TYPE.BLOCK],
            fontWeight: FONT_WEIGHTS.BOLD,
        },
        key: 'part_6',
    },
    {
        label: '. Like it\'s shown above.',
        key: 'part_7',
    },
    {
        label: '\n\nStudy the grid to find the numbers that might fit into each cell.',
        key: 'part_8',
    },
]

export const PUZZLE = {
    UNSOLVED: '590803001000700002740002060000036010206010908010950000020300074300004000100605089',
    SOLVED: '592863741863741592741592863958236417236417958417958236625389174389174625174625389',
}
