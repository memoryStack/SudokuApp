import { HINTS_IDS } from './constants'

export const HINT_ID_VS_TITLES = {
    [HINTS_IDS.NAKED_SINGLE]: 'Naked Single',
    [HINTS_IDS.HIDDEN_SINGLE]: 'Hidden Single',
    [HINTS_IDS.NAKED_DOUBLE]: 'Naked Double',
    [HINTS_IDS.NAKED_TRIPPLE]: 'Naked Tripple',
    [HINTS_IDS.HIDDEN_DOUBLE]: 'Hidden Double',
    [HINTS_IDS.HIDDEN_TRIPPLE]: 'Hidden Tripple',
    [HINTS_IDS.PERFECT_X_WING]: 'X-Wing',
    [HINTS_IDS.FINNED_X_WING]: 'Finned X-Wing',
    [HINTS_IDS.SASHIMI_FINNED_X_WING]: 'Sashimi Finned X-Wing',
    [HINTS_IDS.Y_WING]: 'Y Wing',
    [HINTS_IDS.OMISSION]: 'Omission',
    [HINTS_IDS.ALL]: 'hints',
}

const HIDDEN_GROUP_HINT_EXPLANATION_TEXT = {
    PRIMARY_HOUSE: `In the highlighted {{houseName}}, {{candidatesCountText}} numbers {{candidatesListText}} in green color can come in exactly {{cellsCountText}} cells {{cellsListText}}. so in this {{houseName}} in {{cellsListText}} only {{candidatesListText}} stays and {{removableCandidatesListText}} can be removed.`,
    SECONDARY_HOUSE: `once we remove {{removableCandidatesListText}} from {{groupCellsAxesListText}} then in the highlighted {{houseName}} {{candidatesListText}} will make a {{complementaryHintTitle}} and because of that {{removableGroupCandidatesListText}} can't come in {{removableGroupCandidatesHostCellsListText}}. so we can remove these as well.`,
}

export const HINT_EXPLANATION_TEXTS = {
    [HINTS_IDS.NAKED_SINGLE]: {
        SINGLE_HOUSE: `in this {{houseType}} only the selected cell is empty so from 1-9 only one number can come in this cell which is {{solutionValue}}`,
        MULTIPLE_HOUSE: `except {{solutionValue}} every other number from 1-9 is preset in the row, col and block of this highlighted cell so only number that can appear in this cell is {{solutionValue}}`,
    },
    [HINTS_IDS.HIDDEN_SINGLE]: `in the highlighted {{houseType}}, {{solutionValue}} can't appear in crossed cells due to the highlighted instances of same number. So it has only one place where it can come`,
    [HINTS_IDS.OMISSION]: `In the highlighted {{hostHouseFullName}}, {{note}} is present only in {{hostHouseHostCellsListText}} and these cells are also part of the highlighted {{removableNotesHostHouseFullName}}. so {{note}} in {{removableNotesHostCellsListText}} will be removed when it will be filled in the {{hostHouseFullName}} in one of {{hostHouseHostCellsListTextOrJoined}}.`,
    [HINTS_IDS.NAKED_DOUBLE]: [
        `A Naked Double is a set of two candidates filled in two cells that are part of same row, column or box.\nNote: these two cells can't have more than 2 different set of candidates`,
        `{{candidatesListText}} make a naked double in the highlighted region. in the solution {{candidatesListText}} will be placed in Naked Double cells only and all the candidates of {{candidatesListText}} can be removed from other cells of the highlighted region. {{candidatesListText}} will go in exactly which Naked Double cell is yet not clear.`,
    ],
    [HINTS_IDS.NAKED_TRIPPLE]: [
        `A Naked Tripple is a set of three candidates filled in three cells that are part of same row, column or box.\nNote: these three cells collectively can't have more than 3 different candidates`,
        `{{candidatesListText}} make a naked tripple in the highlighted region. in the solution {{candidatesListText}} will be placed in Naked Tripple cells only and all the candidates of these numbers can be removed from other cells of the highlighted region. {{candidatesListText}} will go in exactly which Naked Tripple cell is yet not clear.`,
    ],
    [HINTS_IDS.HIDDEN_DOUBLE]: HIDDEN_GROUP_HINT_EXPLANATION_TEXT,
    [HINTS_IDS.HIDDEN_TRIPPLE]: HIDDEN_GROUP_HINT_EXPLANATION_TEXT,
    [HINTS_IDS.PERFECT_X_WING]: [
        `in X-Wing we focus on a candidate which is possible in exactly 2 cells of 2 rows or 2 columns.` +
            ` these cells must behave like the corners of a rectangle or square when connected`,
        `if the candidate is found in exactly 2 cells in rows then all the other occurences of candidate in columns` +
            ` can be removed and same is true when candidate is found in exactly 2 cells in columns then it can be removed` +
            ` from other cells in the rows`,
        `notice in highlighted area in the board\n{{candidate}} is present in exactly 2 cells in` +
            ` {{houseAAxesValue}} and {{houseBAxesValue}} {{houseFullName}} forming a {{rectangleCornersText}}` +
            ` rectangle. now in {{houseAAxesValue}} and {{houseBAxesValue}} {{houseFullName}} {{candidate}} can be` +
            ` filled either in {{topDownDiagonalText}} or {{bottomUpDiagonalText}} cells and it will result in removing` +
            ` {{candidate}} from {{crossHouseAAxesValue}} and {{crossHouseBAxesValue}} {{crossHouseFullName}} {{cellsAxesListText}} cells`,
    ],
}
