import { HINTS_IDS } from "./constants"

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

export const HINT_EXPLANATION_TEXTS = {
    [HINTS_IDS.NAKED_SINGLE]: {
        SINGLE_HOUSE: `in this {{houseType}} only the selected cell is empty so from 1-9 only one number can come in this cell which is {{solutionValue}}`,
        MULTIPLE_HOUSE: `except {{solutionValue}} every other number from 1-9 is preset in the row, col and block of this highlighted cell so only number that can appear in this cell is {{solutionValue}}`
    },
    [HINTS_IDS.HIDDEN_SINGLE]: `in the highlighted {{houseType}}, {{solutionValue}} can't appear in crossed cells due to the highlighted instances of same number. So it has only one place where it can come`,
    [HINTS_IDS.NAKED_DOUBLE]: [
        `A Naked Double is a set of two candidates filled in two cells that are part of same row, column or box.\nNote: these two cells can't have more than 2 different set of candidates`,
        `{{candidatesListText}} make a naked double in the highlighted region. in the solution {{candidatesListText}} will be placed in Naked Double cells only and all the candidates of {{candidatesListText}} can be removed from other cells of the highlighted region. {{candidatesListText}} will go in exactly which Naked Double cell is yet not clear.`,
    ],
    [HINTS_IDS.NAKED_TRIPPLE]: [
        `A Naked Tripple is a set of three candidates filled in three cells that are part of same row, column or box.\nNote: these three cells collectively can't have more than 3 different candidates`,
        `{{candidatesListText}} make a naked tripple in the highlighted region. in the solution {{candidatesListText}} will be placed in Naked Tripple cells only and all the candidates of these numbers can be removed from other cells of the highlighted region. {{candidatesListText}} will go in exactly which Naked Tripple cell is yet not clear.`
    ]
}
