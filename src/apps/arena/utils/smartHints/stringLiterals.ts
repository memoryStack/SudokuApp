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

type NakedSingleHintExplainationText = {
    SINGLE_HOUSE: string
    MULTIPLE_HOUSE: string
}

type HiddenGroupHintExplainationText = {
    DEFAULT: string[]
    REMOVABLE_NOTES_IN_SECONDARY_HOUSE: string[]
}

type HintExplainationTexts = {
    [HINTS_IDS.NAKED_SINGLE]: NakedSingleHintExplainationText
    [HINTS_IDS.HIDDEN_SINGLE]: string
    [HINTS_IDS.OMISSION]: string
    [HINTS_IDS.NAKED_DOUBLE]: string[]
    [HINTS_IDS.NAKED_TRIPPLE]: string[]
    [HINTS_IDS.HIDDEN_DOUBLE]: HiddenGroupHintExplainationText
    [HINTS_IDS.HIDDEN_TRIPPLE]: HiddenGroupHintExplainationText
    [HINTS_IDS.PERFECT_X_WING]: string[]
    [HINTS_IDS.FINNED_X_WING]: string[]
    [HINTS_IDS.SASHIMI_FINNED_X_WING]: string[]
    [HINTS_IDS.Y_WING]: string[]
    [HINTS_IDS.REMOTE_PAIRS]: string[]
}

export const HINT_EXPLANATION_TEXTS: HintExplainationTexts = {
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

        'here {{groupCellsText}} are reserved for {{candidatesListTextAndConcatenated}}. Although which number out of {{candidatesListTextAndConcatenated}} will fill exactly which cell is still not clear.'
        + ' but at this point we can say that all the {{candidatesListTextAndConcatenated}} highlighted in red can be removed.',
    ],
    [HINTS_IDS.NAKED_TRIPPLE]: [
        'a Naked Tripple is formed when three cells in any row, column or block have candidates only from a set of 3 candidates.'
        + ' and each cell must have atleast 2 candidates out of these 3.\n'
        + 'here {{groupCellsText}} have a Naked Tripple in {{hostHouses}}.',

        'here {{groupCellsText}} are reserved for {{candidatesListTextAndConcatenated}}. Although which number out of {{candidatesListTextAndConcatenated}} will fill exactly which cell is still not clear.'
        + ' but at this point we can say that all the {{candidatesListTextAndConcatenated}} highlighted in red can be removed.',
    ],
    [HINTS_IDS.HIDDEN_DOUBLE]: {
        DEFAULT: [
            'a Hidden Double is formed when two candidates are present together only in two cells and nowhere else'
            + ' in any row, column or block.'
            + '\nObserve {{candidatesListText}} in {{hostHouseNumText}} {{houseType}}',

            '{{candidatesListText}} can come only in {{groupCellsText}} cells in {{hostHouseNumText}} {{houseType}},'
            + ' so these cells have to be reserved for these numbers only. due to this {{primaryHouseRemovableNotes}} must be'
            + ' removed from {{primaryHouseRemovableNotesHostCells}}',
        ],
        REMOVABLE_NOTES_IN_SECONDARY_HOUSE: [
            'a Hidden Double is formed when two candidates are present together only in two cells and nowhere else'
            + ' in any row, column or block.'
            + '\nObserve {{candidatesListText}} in {{hostHouseNumText}} {{houseType}}',

            '{{candidatesListText}} can come only in {{groupCellsText}} cells in {{hostHouseNumText}} {{houseType}},'
            + ' so these cells have to be reserved for these numbers only. due to this {{primaryHouseRemovableNotes}} must be'
            + ' removed from {{primaryHouseRemovableNotesHostCells}}'
            + '\nNote: {{groupCellsText}} belong in {{secondaryHostHouse}} also, so {{secondaryHouseRemovableNotes}} will be removed'
            + ' from {{secondaryHouseRemovableNotesHostCells}} as well',
        ],
    },
    [HINTS_IDS.HIDDEN_TRIPPLE]: {
        DEFAULT: [
            'a Hidden Tripple is formed when three candidates are present together only in three cells and nowhere else'
            + ' in any row, column or block.\neach of these three cells must have atleast two out of these three candidates.'
            + '\nObserve {{candidatesListText}} in {{hostHouseNumText}} {{houseType}}',

            '{{candidatesListText}} can come only in {{groupCellsText}} cells in {{hostHouseNumText}} {{houseType}},'
            + ' so these cells have to be reserved for these numbers only. due to this {{primaryHouseRemovableNotes}} must be'
            + ' removed from {{primaryHouseRemovableNotesHostCells}}',
        ],
        REMOVABLE_NOTES_IN_SECONDARY_HOUSE: [
            'a Hidden Tripple is formed when three candidates are present together only in three cells and nowhere else'
            + ' in any row, column or block.\neach of these three cells must have atleast two out of these three candidates.'
            + '\nObserve {{candidatesListText}} in {{hostHouseNumText}} {{houseType}}',

            '{{candidatesListText}} can come only in {{groupCellsText}} cells in {{hostHouseNumText}} {{houseType}},'
            + ' so these cells have to be reserved for these numbers only. due to this {{primaryHouseRemovableNotes}} must be'
            + ' removed from {{primaryHouseRemovableNotesHostCells}}'
            + '\nNote: {{groupCellsText}} belong in {{secondaryHostHouse}} also, so {{secondaryHouseRemovableNotes}} will be removed'
            + ' from {{secondaryHouseRemovableNotesHostCells}} as well',
        ],
    },
    [HINTS_IDS.PERFECT_X_WING]: [
        'to spot a X-Wing, start with looking for a candidate which is present only in two cells of'
        + ' any row or column. we need to find either two such rows or two columns.'
        + '\nthese four cells where the candidate is present in these rows or columns must be aligned'
        + ' like four corners of a rectangle.',

        'here {{candidate}} is present only in two cells of {{houseAAxesValue}} and {{houseBAxesValue}}'
        + ' {{houseFullNamePlural}} forming a {{rectangleCornersText}} rectangle.'
        + '\ndue to this arrangement of {{candidate}} in these {{houseFullNamePlural}}, any {{candidate}} that is highlighted'
        + ' in red color in {{crossHouseAAxesValue}} and {{crossHouseBAxesValue}} {{crossHouseFullNamePlural}} can be removed',

        'because to fill {{candidate}} in both {{houseAAxesValue}} and {{houseBAxesValue}} {{houseFullNamePlural}}, it can be'
        + ' filled either in {{topDownDiagonalText}} OR in {{bottomUpDiagonalText}} cells.'
        + '\nbecause of this {{candidate}} present in {{crossHouseAAxesValue}} and {{crossHouseBAxesValue}}'
        + ' {{crossHouseFullNamePlural}} in red color will be removed',
    ],
    [HINTS_IDS.FINNED_X_WING]: [
        'If you don\'t understand X-Wing then you should learn that first.'
        + '\nwhen the candidate is present in more than 2 cells of only one row or column then it\'s not a perfect X-Wing'
        + ' but in some cases we can call it Finned X-Wing. the extra cells where candidate is present are called Finn cells.'
        + '\nnotice extra {{candidate}} in {{finnCellsAxesListText}} {{finnCellEnglishText}} in {{finnedLegAxesText}} {{finnedLegHouseText}}',

        'only one row or column can have these finn cells. and these finn cells must be in the'
        + ' same block with atleast one of the X-Wing corner cells.\nnotice here that {{finnCellsAxesListText}}'
        + ' (finn {{finnCellEnglishText}}) {{shareVerbGrammaticalText}} block with {{finnedBlockPerfectCellsAxesText}} {{cornersText}}',

        'here we can remove {{candidate}} from these {{crossHouseFullNamePlural}} but'
        + ' only from cells which share block with finn cells.'
        + ' because in {{finnedLegAxesText}} {{finnedLegHouseText}} if {{candidate}} comes in {{finnCellsPrefix}} finn {{finnCellEnglishText}}'
        + ' then {{candidate}} can\'t come in {{removableNotesHostCells}} only. and if {{candidate}} doesn\'t come in {{finnCellsPrefix}} finn {{finnCellEnglishText}}'
        + ' then Finned X-Wing will behave like Perfect X-Wing and {{candidate}} will surely not come in {{removableNotesHostCells}}',
    ],
    [HINTS_IDS.SASHIMI_FINNED_X_WING]: [
        'If you don\'t understand Finned X-Wing then you should learn that first.'
        + '\nwhen in Finned X-Wing the candidate is missing in the corner cell which is in same block'
        + ' as finn cells then it will be called Sashimi Finned X-Wing.',

        'here {{candidate}} isn\'t present in {{sashimiCell}} and this cell is in same'
        + ' block as {{finnCellsAxesListText}} finn {{finnCellEnglishText}}'
        + '\njust like Finned X-Wing in Sashimi Finned X-Wing also we can'
        + ' remove {{candidate}} from these {{crossHouseFullNamePlural}} but only from cells which'
        + ' share block with finn cells because however we fill {{candidate}} in {{hostHousesAxesListText}}'
        + ' {{hostHousePluralName}}, in all cases {{candidate}} can\'t come in {{removableNotesHostCells}} {{removableNotesHostCellsText}}.',
    ],
    [HINTS_IDS.Y_WING]: [
        'look for a cell which has only two candidates in it. we will call it pivot cell.'
        + '\nin puzzle {{pivotCell}} is highlighted as pivot cell',

        'now look for two more cells which also have only two candidates in them and which share a row, column or block with'
        + ' pivot cell. these will be wings cells. wings cells themselves shouldn\'t be in same row, column or block.'
        + ' here {{wingCellsText}} are wings cells\n{{firstWingCell}} and {{pivotCell}} are in {{firstWingAndPivotCommonHouse}}'
        + ' and {{secondWingCell}} and {{pivotCell}} are in {{secondWingAndPivotCommonHouse}}. but {{firstWingCell}} and {{secondWingCell}}'
        + ' are not in any same row, column or block',

        'now notice the arrangements of candidates in pivot and wings cells'
        + '\nboth candidates of pivot cell {{pivotCellNotes}} are present separately in both wings cells,'
        + ' {{firstPivotNote}} in {{pivotCellFirstNoteWingHostCell}} and {{secondPivotNote}} in {{pivotCellSecondNoteWingHostCell}}.'
        + ' and other candidate of both wings cells is same, which is {{commonNoteInWings}} here.',

        'due to this arrangement {{commonNoteInWings}} will be removed from cells which share a row, column or block'
        + ' with both wings cells. because in {{pivotCell}} whatever you fill out of {{firstPivotNote}} or'
        + ' {{secondPivotNote}}, atleast one of wings cells must be {{commonNoteInWings}}.'
        + ' so {{removableNotesHostCells}} can\'t have {{commonNoteInWings}} as their solution',
    ],
    [HINTS_IDS.REMOTE_PAIRS]: [
        'Notice the Chain of cells {{chain}}. All of these cells have {{remotePairNotes}} as their candidates.'
        + ' Follow this Chain from {{chainFirstCell}} to {{chainLastCell}}, all of these cells will be filled either'
        + ' by candidates in {{colorA}} or by candidates in {{colorB}}',

        'Fill numbers in these cells any way you want, candidates highlighted in red color will always be removed.'
        + '\nFor Example, in {{exampleRemovableNotesHostCell}} {{exampleRemovableNotesInCell}} can\'t come because'
        + ' {{remotePairNotes}} will always fill {{exampleChainCells}}',
    ],
}
