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
    [HINTS_IDS.REMOTE_PAIRS]: 'Remote Pairs',
    [HINTS_IDS.ALL]: 'hints',
}

export const HINT_EXPLANATION_TEXTS = {
    [HINTS_IDS.NAKED_SINGLE]: {
        SINGLE_HOUSE: 'in this {{houseType}} only {{cellAxesText}} is empty so {{solutionValue}} will come here',
        MULTIPLE_HOUSE: 'except {{solutionValue}} all other numbers from 1-9 are present in {{cellHousesText}} combinedly, so only number that can come in {{cellAxesText}} is {{solutionValue}}',
    },
    [HINTS_IDS.HIDDEN_SINGLE]:
        'in the highlighted {{houseType}}, {{solutionValue}} can\'t come in crossed'
        + ' cells because of {{solutionValue}} in {{filledCellsWithSolutionValue}}. so in {{hostCell}} only'
        + ' {{solutionValue}} can come',
    [HINTS_IDS.OMISSION]:
        'in the highlighted {{hostHouseFullName}}, {{note}} can come only in one of'
        + ' {{hostHouseHostCellsListText}} and all of these cells are part of {{secondaryHouseNumText}} as well.'
        + ' so wherever we try to fill {{note}} in this {{hostHouseFullName}},'
        + ' {{note}} in {{removableNotesHostCellsListText}} can\'t come',
    [HINTS_IDS.NAKED_DOUBLE]: [
        'A Naked Double occurs when two cells in any row, column, or block'
        + ' contain only two possible candidates, and these two cells share the same set of candidates.'
        + '\nhere both {{groupCellsText}} have {{candidatesListTextAndConcatenated}}'
        + ' as their candidates so this forms a Naked Double in {{hostHouses}}.',

        'here {{groupCellsText}} are reserved for {{candidatesListTextAndConcatenated}}. Although where exactly {{candidatesListTextAndConcatenated}} will be filled in {{groupCellsText}} is still not clear.'
        + ' but at this point we are sure that all the {{candidatesListTextAndConcatenated}} highlighted in red can be removed.',
    ],
    [HINTS_IDS.NAKED_TRIPPLE]: [
        'a Naked Tripple is formed when three cells in a row, column or block have candidates only from a set of 3 candidates.\n'
        + 'here {{groupCellsText}} have their candidates only from {{candidatesListTextAndConcatenated}}.',

        'in this highlighted area, {{candidatesListTextAndConcatenated}} will be filled only in {{groupCellsText}}.'
        + ' so we can remove {{candidatesListTextAndConcatenated}} highlighted in red.'
        + ' although where exactly {{candidatesListTextOrConcatenated}} will be filled {{groupCellsText}} is still not clear.',
    ],
    [HINTS_IDS.HIDDEN_DOUBLE]: [
        'a Hidden Double is formed when two candidates are present together only in two cells and nowhere else'
        + ' in a row, column or block then these cells will be reserved for these candidates.\n'
        + 'here in this {{houseType}} {{candidatesListText}} are present only'
        + ' in {{groupCellsText}}',

        'since only {{candidatesListText}} can be filled in {{groupCellsText}}, we can remove all'
        + ' the candidates highlighted in red.\nNote: we are still not clear exactly which candidate will fill which cell',
    ],
    [HINTS_IDS.HIDDEN_TRIPPLE]: [
        'a Hidden Tripple is formed when three candidates are present together only in three cells and nowhere else'
        + ' in a row, column or block then these cells will be reserved for these candidates.\n'
        + 'here in this {{houseType}} {{candidatesListText}} are present only'
        + ' in {{groupCellsText}}',

        'since only {{candidatesListText}} can be filled in {{groupCellsText}}, we can remove all'
        + ' the candidates highlighted in red.\nNote: we are still not clear exactly which candidate will fill which cell',
    ],
    [HINTS_IDS.PERFECT_X_WING]: [
        'in X-Wing we search for a candidate which is present in exactly 2 cells of 2 rows or columns each.'
        + ' these cells must form corners of a rectangle.\n'
        + 'here {{candidate}} is present in exactly 2 cells in {{houseAAxesValue}} and {{houseBAxesValue}}'
        + ' {{houseFullNamePlural}} forming a {{rectangleCornersText}} rectangle.',

        'to fill {{candidate}} in {{houseAAxesValue}} and {{houseBAxesValue}} {{houseFullNamePlural}} it can be'
        + ' filled either in {{topDownDiagonalText}} OR in {{bottomUpDiagonalText}} cells.'
        + ' because of this any other {{candidate}} present in {{crossHouseAAxesValue}} and {{crossHouseBAxesValue}}'
        + ' {{crossHouseFullNamePlural}} except these 4 cells can be removed ',
    ],
    [HINTS_IDS.FINNED_X_WING]: [
        'If you don\'t know about X-Wing then you might not be able to understand this hint.\n'
        + 'when the candidate is present in more than 2 cells in one row or column then it\'s not a perfect X-Wing'
        + ' but we call it Finned X-Wing and the extra cells where candidate is present are called Finn cells.\n'
        + 'Note: in other row or column the candidate must be in exactly 2 cells',

        'notice in the {{finnedLegAxesText}} {{finnedLegHouseText}} if {{candidate}} wasn\'t present'
        + ' in {{finnCellsAxesListText}}(finn {{finnCellEnglishText}}) then it would be a perfect X-Wing.'
        + ' finn cells must be in the same block with one of the X-Wing corner cells, notice'
        + ' {{finnCellsAxesListText}} {{shareVerbGrammaticalText}} block with {{finnedBlockPerfectCellsAxesText}} {{cornersText}}',

        'in this Finned X-Wing we can remove {{candidate}} from these {{crossHouseFullNamePlural}} but'
        + ' only from cells which share block with finn cells.'
        + ' because however we fill {{candidate}} in {{hostHousesAxesListText}} {{hostHousePluralName}}, {{candidate}}'
        + ' can\'t come in {{removableNotesHostCells}} {{removableNotesHostCellsText}}.',
    ],

    [HINTS_IDS.SASHIMI_FINNED_X_WING]: [
        'If you don\'t know about Finned X-Wing then you might not be able to understand this hint.\n'
        + 'when in Finned X-Wing a candidate is missing in one corner which is in same block'
        + ' as finn cells then it is called as Sashimi Finned X-Wing.',

        'notice in the {{finnedLegAxesText}} {{finnedLegHouseText}} {{candidate}} isn\'t present'
        + ' in {{sashimiCellAxesText}}. now just like Finned X-Wing in Sashimi X-Wing also we can'
        + ' remove {{candidate}} from these {{crossHouseFullNamePlural}} but only from cells which'
        + ' share block with finn cells because however we fill {{candidate}} in {{hostHousesAxesListText}}'
        + ' {{hostHousePluralName}}, {{candidate}} can\'t come in {{removableNotesHostCells}} {{removableNotesHostCellsText}}.',
    ],
    [HINTS_IDS.Y_WING]: [
        'To spot a Y-Wing look for a cell which has only 2 candidates. we will call it pivot cell.'
        + ' now look for two more cells with only 2 candidates which share a row, column or block with pivot cell'
        + ' but these two cells themselves shouldn\'t be in same row, column or block.'
        + ' these two cells will be called wings cells.\n'
        + 'one candidate in wing cells should be same and the other candidates'
        + ' from each wing cell should be present in pivot cell.',

        'here {{pivotCell}} is the pivot cell and {{wingCellsText}} are wing cells.'
        + ' now in {{pivotCell}} whatever you fill out of {{firstPivotNote}} or {{secondPivotNote}}, one of'
        + ' {{wingCellsText}} will be {{commonNoteInWings}}. so now we can remove {{commonNoteInWings}} from'
        + ' all the cells which share atleast a row, column or block with both wing cells.\n'
        + 'so here {{eliminableNotesCells}} are such cells from which we can remove {{commonNoteInWings}}.',
    ],
}
