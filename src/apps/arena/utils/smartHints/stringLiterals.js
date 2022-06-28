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
    }
}
