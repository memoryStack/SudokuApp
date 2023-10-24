import { XWING_TYPES } from '../xWing/constants'

export const UNATTAINABLE_TRY_OUT_STATE = 'not sure how we reached here'

export const HIDDEN_GROUP = {
    NO_INPUT:
        'try filling these numbers in the cells where these are'
        + ' highlighted in red or green color to see why green numbers stays'
        + ' and red numbers will be removed',
    REMOVABLE_GROUP_CANDIDATE_FILLED:
        '{{filledCandidatesListText}} {{filledInstancesHelpingVerb}} filled in {{filledCellsAxesListText}}.'
        + ' because of this there {{filledInstancesHelpingVerb}} no'
        + ' cell for {{filledCandidatesListText}} in highlighted {{primaryHouseFullName}}', // TODO: instead of highlighted row, we can actually add the row's name
    INVALID_CANDIDATE_IN_GROUP_CELL: {
        NO_HOST_CELL_FOR_GROUP_CANDIDATES: 'in the highlighted {{primaryHouseFullName}}, there is no cell where {{candidatesListText}} can come.',
        INSUFFICIENT_HOST_CELLS:
            '{{candidatesToBeFilledCount}} numbers {{candidatesListText}} need to be filled'
            + ' but only {{emptyGroupCellsCount}} empty {{emptyGroupCellsNounText}}'
            + ' {{emptyCellsAxesListText}} {{emptyGroupCellsHelpingVerb}} available for these'
            + ' in the highlighted {{primaryHouseFullName}}. so {{candidatesCountWithoutCells}} out of {{candidatesListText}}'
            + ' can\'t be filled in this {{primaryHouseFullName}}.',
    },
    VALID_FILL: {
        FULL:
            '{{candidatesListText}} are filled in {{groupCellsAxesListText}} cells without any'
            + ' error. so only {{candidatesListText}} highlighted in green color stays'
            + ' and other red highlighted numbers can be removed.',
        PARTIAL:
            'try filling {{candidatesListText}} as well where {{candidatesPronoun}} '
            + ' {{candidatesHelpingVerb}} highlighted to find out in which cells {{candidatesListText}}'
            + ' can and can\'t come.',
    },
}

export const NAKED_GROUPS = {
    NO_INPUT:
        'try filling {{candidatesListText}} in the cells where'
        + ' it is highlighted in red or green color to see why this hint works',
    EMPTY_GROUP_CELL:
        '{{emptyCellsListText}} have no candidate left. in the final'
        + ' solution no cell can be empty so, the current arrangement of numbers is invalid',
    MULTIPLE_CELLS_NAKED_SINGLE:
        '{{candidate}} is Naked Single for {{emptyCellsListText}}. if we try to fill it in one of these cells'
        + ' then other {{nakedSingleHostCellNounText}} will have to be empty.'
        + ' so the current arrangement of numbers is wrong',
    VALID_FILL: {
        FULL:
            '{{candidatesListText}} are filled in'
            + ' these cells without any error. now we are sure'
            + ' that {{candidatesListText}} can\'t come in cells where these were highlighted in red',
        PARTIAL:
            'fill {{candidatesListText}} as well'
            + ' to find where these numbers can\'t come in the highlighted region.',
    },
}

export const NAKED_TRIPPLE = {
    FUTURE_EMPTY_CELL: {
        NAKED_SINGLE_PAIR:
            '{{nakedSingleCandidatesWithAndJoin}} are Naked Singles in'
            + ' {{nakedSingleHostCellsAxesText}} respectively. because of'
            + ' this {{futureEmptyCellText}} can\'t have {{nakedSingleCandidatesWithOrJoin}}'
            + ' and it will be empty, which is invalid',
        NAKED_DOUBLE_PAIR: {
            NAKED_SINGLE_IN_THIRD_CELL:
                '{{nakedSingleCandidate}} is the Naked Single in {{nakedSingleHostCell}} because of this'
                + ' {{nakedPairCellAxesText}} will have {{chosenCellsPotentialMultipleNakedSingleCandidate}} as Naked Single'
                + ' in them, which will result in invalid solution',
            NAKED_DOUBLE_IN_THIRD_CELL:
                '{{nakedDoubleCandidatesList}} make a Naked Double in {{nakedDoubleHostCellAxesText}} cells.'
                + ' because of this rule {{futureEmptyCellCandidatesListText}} can\'t come in {{futureEmptyCellText}}'
                + ' and it will be empty',
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
