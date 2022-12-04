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
        SINGLE_HOUSE: `in this {{houseType}} only {{cellAxesText}} is empty so {{solutionValue}} will come here`,
        MULTIPLE_HOUSE: `except {{solutionValue}} all other numbers from 1-9 are present in the highlighted area, so only number that can come in {{cellAxesText}} is {{solutionValue}}`,
    },
    [HINTS_IDS.HIDDEN_SINGLE]: `in the highlighted {{houseType}}, {{solutionValue}} can't come in crossed` +
        ` cells because of {{solutionValue}} in {{filledCellsWithSolutionValue}}. so in {{hostCell}} only` +
        ` {{solutionValue}} can come`,
    [HINTS_IDS.OMISSION]: `in the highlighted {{hostHouseFullName}}, {{note}} can come only in one of` +
        ` {{hostHouseHostCellsListText}}. so wherever we try to fill {{note}} in this {{hostHouseFullName}}` +
        ` {{note}} from {{removableNotesHostCellsListText}} will be removed always`,
    [HINTS_IDS.NAKED_DOUBLE]: [
        `A Naked Double is formed when two cells in a row, column or block have only two candidates` +
        ` and both cells have same set of candidates.\nhere {{groupCellsText}} have {{candidatesListTextAndConcatenated}}` +
        ` as their candidates so this forms a Naked Double.`,

        `in this highlighted area, {{candidatesListTextAndConcatenated}} will be filled only in {{groupCellsText}}.` +
        ` so we can remove {{candidatesListTextAndConcatenated}} highlighted in red. although where exactly` +
        ` {{candidatesListTextOrConcatenated}} will be filled in {{groupCellsText}} is still not clear.`
    ],
    [HINTS_IDS.NAKED_TRIPPLE]: [
        `a Naked Tripple is formed when three cells in a row, column or block have candidates only from a set of 3 candidates.\n` +
        `here {{groupCellsText}} have their candidates only from {{candidatesListTextAndConcatenated}}.`,

        `in this highlighted area, {{candidatesListTextAndConcatenated}} will be filled only in {{groupCellsText}}.` +
        ` so we can remove {{candidatesListTextAndConcatenated}} highlighted in red.` +
        ` although where exactly {{candidatesListTextOrConcatenated}} will be filled {{groupCellsText}} is still not clear.`
    ],
    [HINTS_IDS.HIDDEN_DOUBLE]: [
        `a Hidden Double is formed when two candidates are present together only in two cells and nowhere else` +
        ` in a row, column or block then these cells will be reserved for these candidates.\n` +
        `here in this {{houseType}} {{candidatesListText}} are present only` +
        ` in {{groupCellsText}}`,

        `since only {{candidatesListText}} can be filled in {{groupCellsText}}, we can remove all` +
        ` the candidates highlighted in red.\nNote: we are still not clear exactly which candidate will fill which cell`
    ],
    [HINTS_IDS.HIDDEN_TRIPPLE]: [
        `a Hidden Tripple is formed when three candidates are present together only in three cells and nowhere else` +
        ` in a row, column or block then these cells will be reserved for these candidates.\n` +
        `here in this {{houseType}} {{candidatesListText}} are present only` +
        ` in {{groupCellsText}}`,

        `since only {{candidatesListText}} can be filled in {{groupCellsText}}, we can remove all` +
        ` the candidates highlighted in red.\nNote: we are still not clear exactly which candidate will fill which cell`
    ],
    [HINTS_IDS.PERFECT_X_WING]: [
        `in X-Wing we search for a candidate which is present in exactly 2 cells of 2 rows or columns each.` +
        ` these cells must form corners of a rectangle.\n` +
        `here {{candidate}} is present in exactly 2 cells in {{houseAAxesValue}} and {{houseBAxesValue}}` +
        ` {{houseFullNamePlural}} forming a {{rectangleCornersText}} rectangle.`,

        `to fill {{candidate}} in {{houseAAxesValue}} and {{houseBAxesValue}} {{houseFullNamePlural}} it can be` +
        ` filled either in {{topDownDiagonalText}} OR in {{bottomUpDiagonalText}} cells.` +
        ` because of this any other {{candidate}} present in {{crossHouseAAxesValue}} and {{crossHouseBAxesValue}}` +
        ` {{crossHouseFullNamePlural}} except these 4 cells can be removed `
    ],
    [HINTS_IDS.FINNED_X_WING]: [
        `If you don't know about X-Wing then you might not be able to understand this hint.\n` +
        `when the candidate is present in more than 2 cells in one row or column then it's not a perfect X-Wing` +
        ` but we call it Finned X-Wing and the extra cells where candidate is present are called Finn cells.\n` +
        `Note: in other row or column the candidate must be in exactly 2 cells`,

        `notice in the {{finnedLegAxesText}} {{finnedLegHouseText}} if {{candidate}} wasn't present` +
        ` in {{finnCellsAxesListText}}(finn {{finnCellEnglishText}}) then it would be a perfect X-Wing.` +
        ` finn cells must be in the same block with one of the X-Wing corner cells, notice` +
        ` {{finnCellsAxesListText}} {{shareVerbGrammaticalText}} block with {{finnedBlockPerfectCellsAxesText}} {{cornersText}}`,

        `in this Finned X-Wing we can remove {{candidate}} from these {{crossHouseFullNamePlural}} but` +
        ` only from cells which share block with finn cells.` +
        ` because however we fill {{candidate}} in {{hostHousesAxesListText}} {{hostHousePluralName}}, {{candidate}}` +
        ` can't come in {{removableNotesHostCells}} {{removableNotesHostCellsText}}.`
    ],

    [HINTS_IDS.SASHIMI_FINNED_X_WING]: [
        `If you don't know about Finned X-Wing then you might not be able to understand this hint.\n` +
        `when in Finned X-Wing a candidate is missing in one corner which is in same block` +
        ` as finn cells then it is called as Sashimi Finned X-Wing.`,

        `notice in the {{finnedLegAxesText}} {{finnedLegHouseText}} {{candidate}} isn't present` +
        ` in {{sashimiCellAxesText}}. now just like Finned X-Wing in Sashimi X-Wing also we can` +
        ` remove {{candidate}} from these {{crossHouseFullNamePlural}} but only from cells which` +
        ` share block with finn cells because however we fill {{candidate}} in {{hostHousesAxesListText}}` +
        ` {{hostHousePluralName}}, {{candidate}} can't come in {{removableNotesHostCells}} {{removableNotesHostCellsText}}.`
    ],
    [HINTS_IDS.Y_WING]: [
        `to spot a Y Wing look for a cell which has only 2 candidates. we will call it as pivot cell.` +
        ` now look for two more cells with only 2 candidates.` +
        ` these two cells will be called as wing cells.\n` +
        `these wings should share a row, column or block with the pivot. but these wings themselves can't be in` +
        ` same row, column or block. And one candidate in both wings should be same and the other candidate` +
        ` in wings should also be present in pivot cell.`,

        `here {{pivotCell}} is the pivot cell and {{wingCellsText}} are wings.` +
        ` now in {{pivotCell}} whatever comes out of {{firstPivotNote}} or {{secondPivotNote}}, one of` +
        ` {{wingCellsText}} will be {{commonNoteInWings}}. so now we can remove {{commonNoteInWings}} from` +
        ` all the cells which share a row, column or block with both wing cells.`
    ],
}
