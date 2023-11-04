import { XWING_TYPES } from '../xWing/constants'

export const UNATTAINABLE_TRY_OUT_STATE = 'not sure how we reached here'

export const HIDDEN_GROUP = {
    NO_INPUT: 'try to fill numbers highlighted in red color to understand why these should be removed from these cells',
    REMOVABLE_GROUP_CANDIDATE_FILLED:
        '{{filledCandidatesListText}} {{filledInstancesHelpingVerb}} filled in {{filledCellsAxesListText}}.'
        + ' because of this there {{filledInstancesHelpingVerb}} no'
        + ' {{cellSingularPlural}} left for {{filledCandidatesListText}} in {{primaryHouseFullName}}'
        + '\nto fix this error, remove {{filledCandidatesListText}} from {{filledCellsAxesListText}}',
    INVALID_CANDIDATE_IN_GROUP_CELL: {
        NO_HOST_CELL_FOR_GROUP_CANDIDATES: 'in {{primaryHouseFullName}} {{candidatesListText}} can\'t come in any cell'
        + '\nto fix this error, remove {{wronglyFilledNumbersInGroupCellsListText}} from {{wronglyFilledGroupCellsAxesListText}}',
        INSUFFICIENT_HOST_CELLS:
            '{{candidatesListText}} need to be filled but only {{emptyCellsAxesListText}} {{emptyGroupCellsHelpingVerb}}'
            + ' available for these in {{primaryHouseFullName}}. so {{candidatesCountWithoutCells}} out of {{candidatesListText}}'
            + ' can\'t be filled in this {{primaryHouseFullName}}.'
            + '\nto fix this error, remove {{wronglyFilledNumbersInGroupCellsListText}} from {{wronglyFilledGroupCellsAxesListText}}',
    },
    VALID_FILL: {
        FULL:
            '{{candidatesListText}} are filled in {{groupCellsAxesListText}} cells without any error.'
            + ' this is one of many ways to fill these cells with {{candidatesListText}}. till now we are not sure what'
            + ' will be the exact solution for these cells but we are sure that {{candidatesListText}} can\'t'
            + ' come in cells other than {{groupCellsAxesListText}} in this highlighted region.',

        PARTIAL:
            '{{filledCandidates}} {{filledCandidatesCountHV}} filled in {{filledCandidatesHostCells}} without'
            + ' any error. experiment with filling {{toBeFilledCandidates}} as well to understand where {{toBeFilledCandidatesPronoun}} can or can\'t be filled',
    },
}

export const NAKED_GROUPS = {
    NO_INPUT:
        'try to fill {{candidatesListText}} where'
        + ' it is highlighted in red color to see why these should be removed',
    EMPTY_GROUP_CELL:
        '{{emptyCellsListText}} have no candidate left. in the final'
        + ' solution of puzzle no cell can be empty \nto get back to right track remove'
        + ' {{removableFilledNotes}} from {{removableFilledNotesHostCells}}.'
        + ' {{numbersPronoun}} {{numbersTextSingularPlural}} {{candidatesHV}} belong in {{cellsPronoun}} {{cellsSingularPlural}}',

    MULTIPLE_CELLS_NAKED_SINGLE:
        '{{candidate}} is Naked Single for {{emptyCellsListText}}. fill {{candidate}} in one of'
        + ' these cells to know the fault in previous steps',
    VALID_FILL: {
        FULL:
            '{{candidatesListText}} are filled in {{candidatesHostCells}} cells without any error.'
            + ' this is one of many ways to fill these cells with {{candidatesListText}}. till now we are not sure what'
            + ' will be the exact solution for these cells but we are sure that {{candidatesListText}} can\'t'
            + ' come in cells other than {{candidatesHostCells}} in this highlighted region.',
        PARTIAL:
            '{{filledCandidates}} {{filledCandidatesCountHV}} filled in {{filledCandidatesHostCells}} without'
            + ' any error. experiment with filling {{toBeFilledCandidates}} as well to understand where {{toBeFilledCandidatesPronoun}} should be filled and why',
    },
}

export const NAKED_TRIPPLE = {
    FUTURE_EMPTY_CELL: {
        NAKED_SINGLE_PAIR: 'now fill {{nakedSingleCandidatesWithAndJoin}} in {{nakedSingleHostCellsAxesText}} respectively'
            + ' to know the fault in previous steps',
        NAKED_DOUBLE_PAIR: {
            NAKED_SINGLE_IN_THIRD_CELL: 'now fill {{nakedSingleCandidate}} in {{nakedSingleHostCell}} to know the fault in previous steps',
            NAKED_DOUBLE_IN_THIRD_CELL: 'now fill {{nakedDoubleCandidatesList}} in any of {{nakedDoubleHostCellAxesText}} cells to know the fault in previous steps',
        },
    },
}

export const XWING = {
    NO_INPUT:
        'try filling {{candidate}} in {{houseAAxesValue}} and {{houseBAxesValue}} {{houseFullName}}'
        + ' to understand why all {{candidate}} highlighted in red color can\'t come there and is safe to remove',
    SAME_CROSSHOUSE:
        'now to fill {{candidate}} in {{houseAAxesValue}} and {{houseBAxesValue}}'
        + ' {{houseFullNamePlural}} we have two cells {{xWingHostCellsTexts}} but both of'
        + ' these cells are in {{crossHouse}} {{crossHouseFullName}}',
    ONE_LEG_NO_CANDIDATE:
        'there is no cell in {{inhabitableHouseAxesText}} {{houseFullName}} where {{candidate}} can come',
    ONE_LEG_VALID_FILL:
        '{{candidate}} is filled in {{houseAxesText}} {{houseFullName}} without any error, try filling it'
        + ' in other places as well where it is highlighted in red or green color',
    BOTH_LEG_VALID_FILL:
        '{{candidate}} is filled in {{houseAAxesValue}} and {{houseBAxesValue}} {{houseFullName}} without error'
        + ' and all the red colored {{candidate}}s are also removed.',
    [XWING_TYPES.PERFECT]: {
        BOTH_LEGS_WITHOUT_CANDIDATE: 'there is no cell in {{houseAAxesValue}} and {{houseBAxesValue}} {{houseFullName}} where {{candidate}} can come',
    },
}

export const YWING = {
    NO_INPUT: 'try filling {{candidatesListText}} in highlighted cells',
    CELLS_WITHOUT_CANDIDATE: '{{emptyCellsAxesListText}} {{emptyCellsHelpingVerb}} empty. this is an invalid solution.',
    PIVOT_WILL_BE_EMPTY: '{{wingCellsAxesList}} have only one candidate in them, once {{wingCellsAxesList}} will be filled, {{pivotCellAxes}} will have no candidate left to be filled.',
    MULTIPLE_NS_IN_HOUSE: '{{nakedSingleCellsAxesList}} have only {{nakedSingleCandidate}} as candidate in them and these cells'
        + ' are in same {{nakedSingleCellsCommonHouse}}. so one of these cells will be empty once {{nakedSingleCandidate}} is filled in one of them',
    TRYOUT_PARTIAL_VALID_PROGRESS: 'till now your guesses are correct, fill {{candidatesListText}} in all of these highlighted cells in all combinations to fully understand how this hint works.',
    TRYOUT_COMPLETE: '{{yWingCellsAxesListText}} are filled and you can see that {{eliminableNote}} is not present in {{eliminableCellsAxesListText}}.'
    + ' this can be a solution for {{yWingCellsAxesListText}}.',
}
