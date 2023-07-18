import { fonts } from '@resources/fonts/font'

import { HOUSE_TYPE } from '../arena/utils/smartHints/constants'

import { HOUSE_VS_CELLS_BACKGROUND_COLOR } from './boardData/cellsHighlightData'

export const RULES_TEXT_CONFIG = [
    {
        label: 'A sudoku puzzle begins with a grid in which some of the numbers(known as clues) are already filled.\n\nA puzzle is completed when each number from 1 to 9 appears only once in each of the 9 ',
        key: 'part_1',
    },
    {
        label: 'rows',
        styles: {
            color: HOUSE_VS_CELLS_BACKGROUND_COLOR[HOUSE_TYPE.ROW],
            fontFamily: fonts.bold,
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
            color: HOUSE_VS_CELLS_BACKGROUND_COLOR[HOUSE_TYPE.COL],
            fontFamily: fonts.bold,
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
            color: HOUSE_VS_CELLS_BACKGROUND_COLOR[HOUSE_TYPE.BLOCK],
            fontFamily: fonts.bold,
        },
        key: 'part_6',
    },
    {
        label: '.\n\nStudy the grid to find the numbers that might fit into each cell.',
        key: 'part_7',
    },
]
