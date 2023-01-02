import { XWING_TYPES } from "../xWing/constants"

export const UNATTAINABLE_TRY_OUT_STATE = 'not sure how we reached here'

export const HIDDEN_GROUP = {
    NO_INPUT: `try filling these numbers in the cells where these are` +
        ` highlighted in red or green color to see why green numbers stays` +
        ` and red numbers will be removed`,
    REMOVABLE_GROUP_CANDIDATE_FILLED: `{{filledCandidatesListText}} {{filledInstancesHelpingVerb}} filled in {{filledCellsAxesListText}}.` +
        ` because of this there {{filledInstancesHelpingVerb}} no` +
        ` cell for {{filledCandidatesListText}} in highlighted {{primaryHouseFullName}}`, // TODO: instead of highlighted row, we can actually add the row's name
    INVALID_CANDIDATE_IN_GROUP_CELL: {
        NO_HOST_CELL_FOR_GROUP_CANDIDATES: `in the highlighted {{primaryHouseFullName}}, there is no cell where {{candidatesListText}} can come.`,
        INSUFFICIENT_HOST_CELLS: `{{candidatesToBeFilledCount}} numbers {{candidatesListText}} need to be filled` +
            ` but only {{emptyGroupCellsCount}} empty {{emptyGroupCellsNounText}}` +
            ` {{emptyCellsAxesListText}} {{emptyGroupCellsHelpingVerb}} available for these` +
            ` in the highlighted {{primaryHouseFullName}}. so {{candidatesCountWithoutCells}} out of {{candidatesListText}}` +
            ` can't be filled in this {{primaryHouseFullName}}.`
    },
    VALID_FILL: {
        FULL: `{{candidatesListText}} are filled in {{groupCellsAxesListText}} cells without any` +
            ` error. so only {{candidatesListText}} highlighted in green color stays` +
            ` and other red highlighted numbers can be removed.`,
        PARTIAL: `try filling {{candidatesListText}} as well where {{candidatesPronoun}} ` +
            ` {{candidatesHelpingVerb}} highlighted to find out in which cells {{candidatesListText}}` +
            ` can and can't come.`,
    }
}

export const XWING = {
    NO_INPUT: `try filling {{candidate}} in {{houseAAxesValue}} and {{houseBAxesValue}} {{houseFullName}}` +
        ` to understand why all {{candidate}} highlighted in red color can't come there and is safe to remove`,
    SAME_CROSSHOUSE: `now to fill {{candidate}} in {{houseAAxesValue}} and {{houseBAxesValue}}` +
        ` {{houseFullNamePlural}} we have two cells {{xWingHostCellsTexts}} but both of` +
        ` these cells are in {{crossHouse}} {{crossHouseFullName}}`,
    ONE_LEG_NO_CANDIDATE: `there is no cell in {{inhabitableHouseAxesText}} {{houseFullName}}` +
        ` where {{candidate}} can come`,
    ONE_LEG_VALID_FILL: `{{candidate}} is filled in {{houseAxesText}} {{houseFullName}} without any error, try filling it` +
        ` in other places as well where it is highlighted in red or green color`,
    BOTH_LEG_VALID_FILL: `{{candidate}} is filled in {{houseAAxesValue}} and {{houseBAxesValue}} {{houseFullName}} without error` +
        ` and all the red colored {{candidate}}s are also removed.`,
    [XWING_TYPES.PERFECT]: {
        BOTH_LEGS_WITHOUT_CANDIDATE: `there is no cell in {{houseAAxesValue}} and {{houseBAxesValue}} {{houseFullName}} where {{candidate}} can come`,
    },
}