import { fonts } from "../../resources/fonts/font";

import { HOUSE_TYPE } from "../arena/utils/smartHints/constants";

import { HOUSE_VS_CELLS_BACKGROUND_COLOR } from './boardData/cellsHighlightData'

export const RULES_TEXT_CONFIG = [
    {
        label: 'A sudoku puzzle begins with a grid in which some of the numbers(known as clues) are already filled.\n\nA puzzle is completed when each number from 1 to 9 appears only once in each of the 9 '
    },
    {
        label: 'rows',
        styles: {
            color: HOUSE_VS_CELLS_BACKGROUND_COLOR[HOUSE_TYPE.ROW],
            fontFamily: fonts.bold
        }
    },
    {
        label: ', '
    },
    {
        label: 'columns',
        styles: {
            color: HOUSE_VS_CELLS_BACKGROUND_COLOR[HOUSE_TYPE.COL],
            fontFamily: fonts.bold
        }
    },
    {
        label: ', and '
    },
    {
        label: 'blocks',
        styles: {
            color: HOUSE_VS_CELLS_BACKGROUND_COLOR[HOUSE_TYPE.BLOCK],
            fontFamily: fonts.bold
        }
    },
    {
        label: '.\n\nStudy the grid to find the numbers that might fit into each cell.'
    }
]

export const PAGE_HEADING = 'Rules'