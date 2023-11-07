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
        + ' it is highlighted in red color to understand why these should be removed',
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
    NO_INPUT: 'try to fill {{candidate}} where'
        + ' it is highlighted in red color to understand why these should be removed',
    SAME_CROSSHOUSE: 'now fill {{candidate}} in any of {{houseAAxesValue}} or {{houseBAxesValue}} {{houseFullNamePlural}}'
        + ' to understand the error in previous steps',
    ONE_LEG_NO_CANDIDATE:
        'there is no cell in {{inhabitableHouseAxesText}} {{houseFullName}} where {{candidate}} can come'
        + '\nto fix this error, remove {{candidate}} from {{filledRemovableNotesHostCells}}',
    [XWING_TYPES.PERFECT]: {
        BOTH_LEGS_WITHOUT_CANDIDATE: 'there is no cell in {{houseAAxesValue}} and {{houseBAxesValue}} {{houseFullName}}'
        + ' where {{candidate}} can come\nto fix this error, remove {{candidate}} from {{filledRemovableNotesHostCells}}',
    },
    ONE_LEG_VALID_FILL:
        '{{candidate}} might come in {{filledXWingCornerCell}} cell of {{houseAxesText}} {{houseFullName}} in final solution of puzzle'
        + '\nexperiment with filling {{candidate}} in other places as well where it is highlighted in red or green color',
    BOTH_LEG_VALID_FILL:
        '{{candidate}} is filled in {{houseAAxesValue}} and {{houseBAxesValue}} {{houseFullName}} without any error'
        + ' and notice that all the {{candidate}}s that were in red color are also removed.'
        + '\nyou can fill {{candidate}} in these {{houseFullName}} in other combinations as well, in all such combinations'
        + ' all the {{candidate}}s that were in red color will be removed',
}

export const YWING = {
    NO_INPUT: 'try to fill {{commonNoteInWings}} where it is highlighted in red color to see why these should be removed',
    ELIMINABLE_NOTES_CELL_FILLED: {
        PIVOT_CELL_WITHOUT_CANDIDATE: '{{pivotCell}} is left with no candidates. to fix this error remove {{commonNoteInWings}} from {{eliminableNotesFilledCells}}'
            + ' and then fill one of these wings cells with {{commonNoteInWings}}',
        WING_CELL_WITHOUT_CANDIDATE: '{{emptyWingCell}} is left with no candidates. to fix this error remove {{commonNoteInWings}} from {{eliminableNotesFilledCells}}',
        BOTH_WINGS_WITHOUT_INPUT: 'fill {{wingsCells}} to understand the error in previous steps',
        ONE_OF_WINGS_WITHOUT_INPUT: 'fill {{emptyWingCell}} to understand the error in previous steps',
    },
    PIVOT_CELL_WITHOUT_CANDIDATE: '{{pivotCell}} is left with no candidates. to fix this you will have to fill {{commonNoteInWings}}'
    + ' in one of these wings cells',
    ELIMINABLE_NOTES_CELL_WITHOUT_CANDIDATE: '{{eliminableNotesCellsWithoutCandidates}} have no candidates left. to fix this error'
    + ' try changing numbers in {{filledPivotAndWingsCells}} ',
    VALID_FILL: {
        PARTIAL: '{{filledCandidates}} {{filledCandidatesCountHV}} filled without any error. experiment'
        + ' with filling {{toBeFilledCandidates}} as well to understand where {{toBeFilledCandidatesPronoun}} can or can\'t be filled',
        FULL: '{{candidatesListText}} are filled in pivot and wings cells without any error.'
            + ' this is one of many ways to fill these cells with {{candidatesListText}}. till now we are not sure what'
            + ' will be the exact solution for these cells but we are sure that {{commonNoteInWings}} can\'t'
            + ' come in {{eliminableNotesHostCells}} cells',
    },
}
