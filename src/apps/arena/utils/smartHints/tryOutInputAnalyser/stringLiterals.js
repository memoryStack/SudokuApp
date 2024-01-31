import { getLinkHTMLText } from 'src/apps/hintsVocabulary/vocabExplainations/utils'
import { XWING_TYPES } from '../xWing/constants'
import { HINTS_VOCAB_IDS } from '../rawHintTransformers'

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

export const REMOTE_PAIRS = {
    NO_INPUT: 'try to fill candidates highlighted in red color to see why these should be removed',
    CHAIN_CELL_WITHOUT_CANDIDATE: 'no candidate is present in cell',
    REMOVABLE_NOTES_CELL_FILLED: {
        ALL_CHAIN_CELLS_EMPTY: 'now fill Chain cells in the sequence given by arrows to understand why {{removableNotesFilled}} shouldn\'t be filled'
            + ' in {{removableNotesFilledHostCells}}',
        CHAIN_CELLS_PARTIALLY_FILLED: 'keep filling Chain cells to understand the problem created after filling {{removableNotesFilled}}'
            + ' in {{removableNotesFilledHostCells}}',
        CHAIN_CELL_WITHOUT_CANDIDATE: {
            ONLY_REMOVABLE_NOTES_FILLED: 'no candidates are left for {{emptyCells}}. to fix it, remove number from {{removableNotesFilledHostCells}}',
            BOTH_COLORS_CANDIDATES_FILLED: 'no candidates are left for {{emptyCells}}. to fill numbers in Chain cells properly, first remove number'
                + ' from {{removableNotesFilledHostCells}} and then you will have to erase some numbers from Chain cells as well so that Chain cells'
                + ' are filled by same color numbers only',
        },
    },
    CHAIN_CELLS_BOTH_COLOR_CANDIDATES_FILLED: {
        CELL_WITH_NO_CANDIDATES_IN_PROGRESS: 'Chain cells are filled with both colors numbers. keep filling the Chain to understand why it will be'
            + ' filled by same color numbers only',
        CELL_WITH_NO_CANDIDATES: 'no candidates are left for {{emptyCells}}. to fix this error either remove number from'
            + ' {{colorACells}} or from {{colorBCells}} because this Chain can be filled by same colors numbers only otherwise'
            + ' some cells will be left without any candidates.',
    },
    VALID_FILL: {
        PARTIAL: 'till now you have filled Chain cells correctly. fill other cells as well to fully understand this technique',
        FULL: 'yayy! you have successfully filled all the cells in the Chain. this is one of the solutions to fill these cells.'
            + ' also notice that all the candidates highlighted in red color from {{removableNotesHostCells}} are removed.'
            + ' try to fill these Chain cells in another way and you will find that the result will be same.',
    },
}

export const EMPTY_RECTANGLE = {
    NO_INPUT: 'Fill {{candidate}} in any of these highlighted cells to understand why {{candidate}} can not come in {{removableNoteHostCell}}',
    REMOVABLE_NOTE_CELL_FILLED: {
        BLOCK_OR_CONJUGATE_HOUSE_FILLED: 'Notice that there is no cell left for {{candidate}} in {{candidateInhabitableHostHouse}}. To fix this error, remove {{candidate}} from {{removableNoteHostCell}} and start again',
        BLOCK_OR_CONJUGATE_HOUSE_NOT_FILLED: 'Now fill {{candidate}} either in {{conjugateHouse}} or {{blockHostHouse}} to know the fault in previous step',
    },
    CONJUGATE_HOUSE_AND_BLOCK_HOST_HOUSE_FILLED: '{{candidate}} might be filled in this combination in {{conjugateHouse}} and {{blockHostHouse}} in the final solution of the puzzle. Try to fill {{candidate}} in other'
        + ' combinations, in all of them {{candidate}} will be removed from {{removableNoteHostCell}}',
    CONJUGATE_HOUSE_FILLED: {
        REMOVABLE_NOTE_PRESENT: 'Now fill {{candidate}} anywhere in {{blockHostHouse}} or fill it in {{removableNoteHostCell}}',
        REMOVABLE_NOTE_REMOVED: 'If {{candidate}} is filled in {{filledHostCell}} then {{candidate}} can not come in {{removableNoteHostCell}}'
    },
    BLOCK_HOST_HOUSE_FILLED: {
        REMOVABLE_NOTE_PRESENT: 'Now fill {{candidate}} anywhere in {{conjugateHouse}} or fill it in {{removableNoteHostCell}}',
        REMOVABLE_NOTE_REMOVED: 'If {{candidate}} is filled in {{filledHostCell}} then {{candidate}} can not come in {{removableNoteHostCell}}'
    }
}

export const W_WING = {
    NO_INPUT: 'Fill {{nakedPairCandidates}} in any of these highlighted cells to understand why {{removableCandidate}} can not come in {{removableNoteHostCells}}',
    REMOVABLE_NOTE_CELL_FILLED: {
        NO_OTHER_CELL_FILLED: `<p>Notice the ${getLinkHTMLText(HINTS_VOCAB_IDS.NAKED_SINGLE, 'Naked Single')} created in {{nakedSinglesCells}}. Now fill these cells to understand the fault in previous step</p>`,
        CONJUGATE_HOUSE_FILLED: 'there are no candidates left for {{nakedPairCellWithNoCandidates}}. to fix it, remove {{removableNote}} from {{filledRemovableNoteHostCell}} and try some other combination to fill these cells',
        ONE_NAKED_PAIR_CELL_FILLED: 'Fill {{emptyNakedPairCell}} as well because it has Naked Single in it',
        BOTH_NAKED_PAIR_CELLS_FILLED: 'Notice that now there is no cell in {{conjugateHouse}} where {{conjugateHouseNote}} can be filled. to fix it remove {{removableNote}} from {{filledRemovableNoteHostCell}} and start again',
    },
    CONJUGATE_CELL_FILLED: {
        NO_OTHER_CELL_FILLED: `<p>Notice the ${getLinkHTMLText(HINTS_VOCAB_IDS.NAKED_SINGLE, 'Naked Single')} created in {{nakedSinglesCells}}. Now this cell has to be filled with {{removableNote}}</p>`,
        ONE_NAKED_PAIR_CELL_FILLED: {
            REMOVABLE_NOTE_FILLED_IN_NAKED_PAIR_CELL: 'now you can fill {{candidatesChoicesInEmptyCell}} in {{emptyCell}} if you want. in the final solution these cells might be filled in this combination'
                + ' and notice that all the {{removableNote}} highlighted in red color have been removed also',
            CONJUGATE_NOTE_FILLED_IN_NAKED_PAIR_CELL: 'now fill Naked Single in {{emptyCell}}'
        },
        BOTH_NAKED_PAIR_CELL_FILLED: 'in the final solution these cells might be filled in this combination'
            + ' and notice that all the {{removableNote}} highlighted in red color have been removed also'
    },
    NAKED_PAIR_CELL_FILLED: {
        FILLED_WITH_REMOVABLE_NOTE: 'If {{removableNote}} comes in {{filledNakedPairCells}} in the final solution then definitely {{removableNote}} can not come in the cells where it was highlighted in red color',
        ONE_NAKED_PAIR_CELL_FILLED_WITH_CONJUGATE_NOTE: `<p>Notice the ${getLinkHTMLText(HINTS_VOCAB_IDS.HIDDEN_SINGLE, 'Hidden Single')} created in {{conjugateHouse}} in {{hiddenSingleCell}}. Now this cell has to be filled with {{conjugateNote}}</p>`,
        NO_PLACE_FOR_CONJUGATE_NOTE_IN_CONJUGATE_HOUSE: 'Notice that now there is no cell in {{conjugateHouse}} where {{conjugateHouseNote}} can be filled. to fix it remove {{conjugateHouseNote}} from one of {{nakedPairCells}} and start again'
    },
}

export const XYZ_WING = {
    NO_INPUT: 'fill {{xyzCellsCandidates}} in any of these highlighted cells to understand why {{removableCandidate}} can not come in {{removableNoteHostCells}}',
    REMOVABLE_NOTE_CELL_FILLED: {
        NO_OTHER_CELL_FILLED: `<p>notice the ${getLinkHTMLText(HINTS_VOCAB_IDS.NAKED_SINGLE, 'Naked Single')} created in {{nakedSinglesCells}}. Now fill these cells to understand the fault in previous step</p>`,
        CELLS_HAVE_NAKED_SINGLE: 'now {{nakedSinglesCells}} have Naked Single, next step can be to fill {{nakedSinglesCells}}.',
        CELL_WITHOUT_CANDIDATES: 'there are no candidates left for {{cellsWithNoCandidates}}. to fix it, remove {{removableCandidate}} from {{filledRemovableNoteHostCell}} and try some other combination to fill these highlighted cells',
    },
    ALL_CELLS_FILLED_PROPERLY: 'Yayy! you have filled {{xyzCells}} without any error. this combination may or may not be the final solution for these cells.'
        + ' but notice that all the {{removableCandidate}} highlighted in red color have been removed',
    COMMON_NOTE_FILLED_IN_ANY_WING_CELLS: 'you can fill {{emptyWingCells}} if you want but if {{removableCandidate}} fills {{wingCellsFilledWithRemovableCandidate}} in the final solution of puzzle'
        + ' then {{removableCandidate}} can not come in {{removableNoteHostCells}}. as you can see that {{removableCandidate}} has been removed from {{removableNoteHostCells}}',
    PARTIALLY_FILLED: 'till now you have filled cells without any error. fill other cells as well with the candidates highlighted in them'
}
