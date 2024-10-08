import { getLinkHTMLText } from 'src/apps/hintsVocabulary/vocabExplainations/utils'
import { HINTS_VOCAB_IDS } from './rawHintTransformers/constants'
import { HINTS_IDS } from './constants'
import { UR_TYPES } from './uniqueRectangle/constants'

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
    [HINTS_IDS.Y_WING]: 'Y-Wing',
    [HINTS_IDS.OMISSION]: 'Omission',
    [HINTS_IDS.REMOTE_PAIRS]: 'Remote Pairs',
    [HINTS_IDS.X_CHAIN]: 'X-Chain',
    [HINTS_IDS.XY_CHAIN]: 'XY-Chain',
    [HINTS_IDS.EMPTY_RECTANGLE]: 'Empty Rectangle',
    [HINTS_IDS.W_WING]: 'W-Wing',
    [HINTS_IDS.XYZ_WING]: 'XYZ-Wing',
    [HINTS_IDS.UNIQUE_RECTANGLE]: 'Unique Rectangle',
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
    [HINTS_IDS.X_CHAIN]: string[]
    [HINTS_IDS.XY_CHAIN]: string[]
    [HINTS_IDS.EMPTY_RECTANGLE]: string[]
    [HINTS_IDS.W_WING]: string[]
    [HINTS_IDS.XYZ_WING]: string[]
    [HINTS_IDS.UNIQUE_RECTANGLE]: {}
}

export const HINT_EXPLANATION_TEXTS: HintExplainationTexts = {
    [HINTS_IDS.NAKED_SINGLE]: {
        SINGLE_HOUSE: `<p>in this {{houseType}} only {{cellAxesText}} ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cell')} is empty so {{solutionValue}} will come here</p>`,
        MULTIPLE_HOUSE: '<p>except {{solutionValue}} all other numbers from 1-9 are present in {{cellHousesText}} combinedly, so only number that can come in {{cellAxesText}} is {{solutionValue}}</p>',
    },
    [HINTS_IDS.HIDDEN_SINGLE]:
        '<p>in the highlighted {{houseType}}, {{solutionValue}} can\'t come in crossed'
        + ` ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cells')} because of {{solutionValue}} in {{filledCellsWithSolutionValue}}. so in {{hostCell}} only`
        + ' {{solutionValue}} can come</p>',
    [HINTS_IDS.OMISSION]:
        '<p>in the highlighted {{hostHouseFullName}}, {{note}} can come only in one of'
        + ` {{hostHouseHostCellsListText}} and all of these ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cells')} are part of {{secondaryHouseNumText}} as well.`
        + ' so wherever we try to fill {{note}} in this {{hostHouseFullName}},'
        + ' {{note}} in {{removableNotesHostCellsListText}} can\'t come</p>',
    [HINTS_IDS.NAKED_DOUBLE]: [
        `<p>A Naked Double occurs when two ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cells')} in any ${getLinkHTMLText(HINTS_VOCAB_IDS.HOUSE, 'house')}`
        + ` contain only two possible ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidates')}, and these`
        + ' two cells share the same set of candidates.'
        + '\nhere both {{groupCellsText}} have {{candidatesListTextAndConcatenated}}'
        + ' as their candidates so this forms a Naked Double in {{hostHouses}}.</p>',

        'here {{groupCellsText}} are reserved for {{candidatesListTextAndConcatenated}}. Although which number out'
        + ' of {{candidatesListTextAndConcatenated}} will fill exactly which cell is still not clear.'
        + ' but at this point we can say that all the {{candidatesListTextAndConcatenated}} highlighted in red can be removed.',
    ],
    [HINTS_IDS.NAKED_TRIPPLE]: [
        `<p>a Naked Tripple is formed when three ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cells')} in any`
        + ` ${getLinkHTMLText(HINTS_VOCAB_IDS.HOUSE, 'house')} have ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidates')} only from a`
        + ' set of 3 candidates. and each cell must have atleast 2 candidates out of these 3.\n'
        + 'here {{groupCellsText}} have a Naked Tripple in {{hostHouses}}.</p>',

        'here {{groupCellsText}} are reserved for {{candidatesListTextAndConcatenated}}. Although which number out of {{candidatesListTextAndConcatenated}} will fill exactly which cell is still not clear.'
        + ' but at this point we can say that all the {{candidatesListTextAndConcatenated}} highlighted in red can be removed.',
    ],
    [HINTS_IDS.HIDDEN_DOUBLE]: {
        DEFAULT: [
            `<p>a Hidden Double is formed when two ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidates')} are present together only in two ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cells')} and nowhere else`
            + ` in any ${getLinkHTMLText(HINTS_VOCAB_IDS.HOUSE, 'house')}.`
            + '\nObserve {{candidatesListText}} in {{hostHouseNumText}} {{houseType}}</p>',

            '{{candidatesListText}} can come only in {{groupCellsText}} cells in {{hostHouseNumText}} {{houseType}},'
            + ' so these cells have to be reserved for these numbers only. due to this {{primaryHouseRemovableNotes}} must be'
            + ' removed from {{primaryHouseRemovableNotesHostCells}}',
        ],
        REMOVABLE_NOTES_IN_SECONDARY_HOUSE: [
            `<p>a Hidden Double is formed when two ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidates')} are present together only in two ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cells')} and nowhere else`
            + ` in any ${getLinkHTMLText(HINTS_VOCAB_IDS.HOUSE, 'house')}.`
            + '\nObserve {{candidatesListText}} in {{hostHouseNumText}} {{houseType}}</p>',

            '{{candidatesListText}} can come only in {{groupCellsText}} cells in {{hostHouseNumText}} {{houseType}},'
            + ' so these cells have to be reserved for these numbers only. due to this {{primaryHouseRemovableNotes}} must be'
            + ' removed from {{primaryHouseRemovableNotesHostCells}}'
            + '\nNote: {{groupCellsText}} belong in {{secondaryHostHouse}} also, so {{secondaryHouseRemovableNotes}} will be removed'
            + ' from {{secondaryHouseRemovableNotesHostCells}} as well',
        ],
    },
    [HINTS_IDS.HIDDEN_TRIPPLE]: {
        DEFAULT: [
            `<p>a Hidden Tripple is formed when three ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidates')} are present together only in three ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cells')} and nowhere else`
            + ` in any ${getLinkHTMLText(HINTS_VOCAB_IDS.HOUSE, 'house')}.\neach of these three cells must have atleast two out of these three candidates.`
            + '\nObserve {{candidatesListText}} in {{hostHouseNumText}} {{houseType}}</p>',

            '{{candidatesListText}} can come only in {{groupCellsText}} cells in {{hostHouseNumText}} {{houseType}},'
            + ' so these cells have to be reserved for these numbers only. due to this {{primaryHouseRemovableNotes}} must be'
            + ' removed from {{primaryHouseRemovableNotesHostCells}}',
        ],
        REMOVABLE_NOTES_IN_SECONDARY_HOUSE: [
            `<p>a Hidden Tripple is formed when three ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidates')} are present together only in three ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cells')} and nowhere else`
            + ` in any ${getLinkHTMLText(HINTS_VOCAB_IDS.HOUSE, 'house')}.\neach of these three cells must have atleast two out of these three candidates.`
            + '\nObserve {{candidatesListText}} in {{hostHouseNumText}} {{houseType}}</p>',

            '{{candidatesListText}} can come only in {{groupCellsText}} cells in {{hostHouseNumText}} {{houseType}},'
            + ' so these cells have to be reserved for these numbers only. due to this {{primaryHouseRemovableNotes}} must be'
            + ' removed from {{primaryHouseRemovableNotesHostCells}}'
            + '\nNote: {{groupCellsText}} belong in {{secondaryHostHouse}} also, so {{secondaryHouseRemovableNotes}} will be removed'
            + ' from {{secondaryHouseRemovableNotesHostCells}} as well',
        ],
    },
    [HINTS_IDS.PERFECT_X_WING]: [
        `<p>to spot an X-Wing, start with looking for a ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidate')} which is`
        + ` present only in two ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cells')} of`
        + ` any ${getLinkHTMLText(HINTS_VOCAB_IDS.ROW, 'row')} or ${getLinkHTMLText(HINTS_VOCAB_IDS.COLUMN, 'column')}. we need to find either two such rows or two columns.`
        + '\nthese four cells where the candidate is present in these rows or columns must be aligned'
        + ' like four corners of a rectangle.</p>', // or square

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
        `<p>If you don't understand ${getLinkHTMLText(HINTS_VOCAB_IDS.PERFECT_X_WING, 'X-Wing')} then you should learn that first.`
        + `\nwhen the ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidate')} is present in more than 2 ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cells')} of only one ${getLinkHTMLText(HINTS_VOCAB_IDS.ROW, 'row')} or ${getLinkHTMLText(HINTS_VOCAB_IDS.COLUMN, 'column')} then it's not a perfect X-Wing`
        + ` but in some cases we can call it Finned X-Wing. the extra cells where candidate is present are called ${getLinkHTMLText(HINTS_VOCAB_IDS.X_WING_FINN_CELLS, 'Finn Cells')}.`
        + '\nnotice extra {{candidate}} in {{finnCellsAxesListText}} {{finnCellEnglishText}} in {{finnedLegAxesText}} {{finnedLegHouseText}}</p>',

        '<p>only one row or column can have these finn cells. and these finn cells must be in the'
        + ` same ${getLinkHTMLText(HINTS_VOCAB_IDS.BLOCK, 'block')} with atleast one of the X-Wing ${getLinkHTMLText(HINTS_VOCAB_IDS.X_WING_CORNER_CELLS, 'corner cells')}.\nnotice here that {{finnCellsAxesListText}}`
        + ' (finn {{finnCellEnglishText}}) {{shareVerbGrammaticalText}} block with {{finnedBlockPerfectCellsAxesText}} {{cornersText}}</p>',

        'here we can remove {{candidate}} from these {{crossHouseFullNamePlural}} but'
        + ' only from cells which share block with finn cells.'
        + ' because in {{finnedLegAxesText}} {{finnedLegHouseText}} if {{candidate}} comes in {{finnCellsPrefix}} finn {{finnCellEnglishText}}'
        + ' then {{candidate}} can\'t come in {{removableNotesHostCells}} only. and if {{candidate}} doesn\'t come in {{finnCellsPrefix}} finn {{finnCellEnglishText}}'
        + ' then Finned X-Wing will behave like Perfect X-Wing and {{candidate}} will surely not come in {{removableNotesHostCells}}',
    ],
    [HINTS_IDS.SASHIMI_FINNED_X_WING]: [
        `<p>If you don't understand ${getLinkHTMLText(HINTS_VOCAB_IDS.FINNED_X_WING, 'Finned X-Wing')} then you should learn that first.`
        + `\nwhen in Finned X-Wing the ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidate')} is missing in one of the`
        + ` ${getLinkHTMLText(HINTS_VOCAB_IDS.X_WING_CORNER_CELLS, 'corner')}  ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cell')} which is in same ${getLinkHTMLText(HINTS_VOCAB_IDS.BLOCK, 'block')}`
        + ` as ${getLinkHTMLText(HINTS_VOCAB_IDS.X_WING_FINN_CELLS, 'finn cells')} then it will be called Sashimi Finned X-Wing.</p>`,

        'here {{candidate}} isn\'t present in {{sashimiCell}} and this cell is in same'
        + ' block as {{finnCellsAxesListText}} finn {{finnCellEnglishText}}'
        + '\njust like Finned X-Wing in Sashimi Finned X-Wing also we can'
        + ' remove {{candidate}} from these {{crossHouseFullNamePlural}} but only from cells which'
        + ' share block with finn cells because however we fill {{candidate}} in {{hostHousesAxesListText}}'
        + ' {{hostHousePluralName}}, in all cases {{candidate}} can\'t come in {{removableNotesHostCells}} {{removableNotesHostCellsText}}.',
    ],
    [HINTS_IDS.Y_WING]: [
        `<p>look for a ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cell')} which has only two ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidates')}`
        + ' in it. we will call it pivot cell.\nin puzzle {{pivotCell}} is highlighted as pivot cell</p>',

        `<p>now look for two more cells which also have only two candidates in them and which share a ${getLinkHTMLText(HINTS_VOCAB_IDS.HOUSE, 'house')} with`
        + ' pivot cell. these will be wings cells. wings cells themselves shouldn\'t be in same house.'
        + ' here {{wingCellsText}} are wings cells\n{{firstWingCell}} and {{pivotCell}} are in {{firstWingAndPivotCommonHouse}}'
        + ' and {{secondWingCell}} and {{pivotCell}} are in {{secondWingAndPivotCommonHouse}}. but {{firstWingCell}} and {{secondWingCell}}'
        + ' are not in any same house</p>',

        '<p>now notice the arrangements of candidates in pivot and wings cells'
        + '\nboth candidates of pivot cell {{pivotCellNotes}} are present separately in both wings cells,'
        + ' {{firstPivotNote}} in {{pivotCellFirstNoteWingHostCell}} and {{secondPivotNote}} in {{pivotCellSecondNoteWingHostCell}}.'
        + ` and other ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidate')} of both wings cells is same, which is {{commonNoteInWings}} here.</p>`,

        'due to this arrangement {{commonNoteInWings}} will be removed from cells which share a house'
        + ' with both wings cells. because in {{pivotCell}} whatever you fill out of {{firstPivotNote}} or'
        + ' {{secondPivotNote}}, atleast one of wings cells must be {{commonNoteInWings}}.'
        + ' so {{removableNotesHostCells}} can\'t have {{commonNoteInWings}} as their solution',
    ],
    [HINTS_IDS.REMOTE_PAIRS]: [
        `<p>Notice the Chain of ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cells')} {{chain}}. All of these cells have {{remotePairNotes}} as their ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidates')}.`
        + ' Follow this Chain from {{chainFirstCell}} to {{chainLastCell}}, all of these cells will be filled either'
        + ' by candidates in {{colorA}} or by candidates in {{colorB}}</p>',

        'Fill numbers in these cells any way you want, candidates highlighted in red color will always be removed.'
        + '\nFor Example, in {{exampleRemovableNotesHostCell}} {{exampleRemovableNotesInCell}} can\'t come because'
        + ' {{remotePairNotes}} will always fill {{exampleChainCells}}',
    ],
    [HINTS_IDS.X_CHAIN]: [
        `<p>Notice the Chain of ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cells')} {{chain}}. All of these cells have {{note}} as their ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidate')}.`
        + '\nFollow this Chain from {{chainFirstCell}} to {{chainLastCell}}, {{firstWayToFillChainCells}}.</p>',

        'another way to fill {{note}} in this Chain is to fill it in reverse order like {{secondWayToFillChainCells}}.'
        + '\nin both of these ways either {{chainFirstCell}} or {{chainLastCell}} will definitely be {{note}},'
        + ' due to this {{removableNotesHostCells}} can\'t be {{note}} in any way',
    ],
    [HINTS_IDS.XY_CHAIN]: [
        `<p>Notice the Chain of ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cells')} {{chain}}. All of these cells have`
        + ` two ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidates')} and any two consecutive cells have one candidate`
        + ' common. For Example, {{chainFirstCell}} and {{chainSecondCell}} both have {{firstLinkCommonCandidate}} as their candidate.'
        + ' And also note that {{chainFirstCell}}(first cell) and {{chainLastCell}}(last cell) both have {{removableNote}} as their candidate in them.'
        + `\nThis type of chain of cells is called ${HINT_ID_VS_TITLES[HINTS_IDS.XY_CHAIN]}.`
        + '</p>',

        '<p>Now {{chainFirstCell}} can be filled in two ways.'
        + '<br />'
        + '<b>First:</b> Fill {{removableNote}} here.'
        + '<br />'
        + '<b>Second:</b> Fill {{firstCellCandidateOtherThanRemovableCandidate}} here. Due to this {{chainFillingWay}}.'
        + '<br />'
        + 'Notice that in both ways, either {{chainFirstCell}} or {{chainLastCell}} will be filled by {{removableNote}}.'
        + '<br />'
        + `So all the {{removableNote}}s from {{removableNotesHostCells}} will be removed because these cells share ${getLinkHTMLText(HINTS_VOCAB_IDS.HOUSE, 'house')}`
        + ' with first and last cell of this chain.'
        + '</p>',
    ],
    [HINTS_IDS.EMPTY_RECTANGLE]: [
        `<p>Notice ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidate')} {{candidate}} in {{conjugateHouseWithHouseTypeLink}} and {{hostBlockHouseWithHouseTypeLink}}.`
        + ' No matter where {{candidate}} is filled in {{conjugateHouse}} and {{hostBlockHouse}}, {{candidate}} will always be removed'
        + ` from {{removableNoteHostCell}} ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cell')}.`
        + '\nClick on Next button to exercise this hint.'
        + '</p>'
    ],
    [HINTS_IDS.W_WING]: [
        '<p>'
        + 'Notice that in {{conjguateHouse}} no matter where you fill {{conjugateHouseNote}}, one of {{nakedPairHostCells}} have to be filled by'
        + ' {{removableNote}}.'
        + '\nIf {{conjugateHouseNote}} is filled in {{firstConjugateHouseCell}} then {{firstNakedPairHostCell}} have to be {{removableNote}} and if'
        + ' {{conjugateHouseNote}} is filled in {{secondConjugateHouseCell}} then {{secondNakedPairHostCell}} have to be {{removableNote}}.'
        + '\nSo all the {{removableNote}} in red color can be removed.'
        + '</p>'
    ],
    [HINTS_IDS.XYZ_WING]: [
        '<p>'
        + `Notice three ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cells')} {{xyzWingCells}}, these have their ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidates')} only from {{xyzWingCandidates}}.`
        + ' You can fill {{xyzWingCandidates}} in {{xyzWingCells}} in any combination, one of these cells must be filled by {{wingsAndPivotCommonNote}} for sure.'
        + '\nHence {{wingsAndPivotCommonNote}} can be removed from {{removableNoteHostCells}}'
        + '</p>'
    ],
    [HINTS_IDS.UNIQUE_RECTANGLE]: {
        // TODO: there is a lot of copy pasting here for the same msg, fix it
        [UR_TYPES.TYPE_ONE]: {
            singleExtraCandidateMsg: [
                `<p>If {{extraNotesText}} doesn't come in {{cellWithExtraCandidates}} then each of these 4 cells will be left`
                + ' with two candidates {{firstURNote}} and {{secondURNote}}. It will result in two ways to fill these cells without impacting other cells in any way.'
                + '<br/>'
                + 'One way is to fill {{firstURNote}} in {{firstHostCell}}, {{secondURNote}}'
                + ' in {{secondHostCell}}, {{firstURNote}} in {{thirdHostCell}} and {{secondURNote}} in {{fourthHostCell}}.'
                + ' And second way is to fill {{secondURNote}} in {{firstHostCell}}, {{firstURNote}}'
                + ' in {{secondHostCell}}, {{secondURNote}} in {{thirdHostCell}} and {{firstURNote}} in {{fourthHostCell}}'
                + '</p>',
                'This puzzle has only one valid solution so it is impossible to fill these 4 cells with just {{firstURNote}} and {{secondURNote}}.'
                + ' So in {{cellWithExtraCandidates}} {{firstURNote}} and {{secondURNote}} have to be removed.'
            ],
            multipleExtraCandidateMsg: [
                '<p>If none of {{extraNotesText}} comes in {{cellWithExtraCandidates}} then each of these 4 cells will be left'
                + ' with two candidates {{firstURNote}} and {{secondURNote}}. It will result in two ways to fill these cells without impacting other cells in any way.'
                + '<br/>'
                + 'One way is to fill {{firstURNote}} in {{firstHostCell}}, {{secondURNote}}'
                + ' in {{secondHostCell}}, {{firstURNote}} in {{thirdHostCell}} and {{secondURNote}} in {{fourthHostCell}}.'
                + ' And second way is to fill {{secondURNote}} in {{firstHostCell}}, {{firstURNote}}'
                + ' in {{secondHostCell}}, {{secondURNote}} in {{thirdHostCell}} and {{firstURNote}} in {{fourthHostCell}}'
                + '</p>',
                'This puzzle has only one valid solution so it is impossible to fill these 4 cells with just {{firstURNote}} and {{secondURNote}}.'
                + ' So in {{cellWithExtraCandidates}} {{firstURNote}} and {{secondURNote}} have to be removed.'
            ]
        },
        [UR_TYPES.TYPE_TWO]: [
            `<p>If {{extraNote}} doesn't comes in any of {{cellsWithExtraCandidateList}} then each of these 4 cells {{urHostCellsList}} will be left`
            + ' with two candidates {{firstURNote}} and {{secondURNote}}. It will result in two ways to fill these cells without impacting other cells in any way.'
            + '<br/>'
            + 'One way is to fill {{firstURNote}} in {{firstHostCell}}, {{secondURNote}}'
            + ' in {{secondHostCell}}, {{firstURNote}} in {{thirdHostCell}} and {{secondURNote}} in {{fourthHostCell}}.'
            + ' And second way is to fill {{secondURNote}} in {{firstHostCell}}, {{firstURNote}}'
            + ' in {{secondHostCell}}, {{secondURNote}} in {{thirdHostCell}} and {{firstURNote}} in {{fourthHostCell}}'
            + '</p>',
            'This puzzle has only one valid solution so it is impossible to fill these 4 cells with just {{firstURNote}} and {{secondURNote}}.'
            + ' So in one of {{cellsWithExtraCandidateList}} {{extraNote}} will come and due to that {{extraNote}} will be removed from the cells where it is highlighted in red color.'
        ],
        [UR_TYPES.TYPE_THREE]: [
            '<p>If none of {{ngCandidates}} come in {{cellsWithExtraCandidates}} then these'
            + ' 4 cells {{urHostCells}} will be filled by {{urNotes}} only and it would lead to two ways of solving this puzzle.'
            + '<br/>'
            + 'One way is to fill {{firstURNote}} in {{firstHostCell}}, {{secondURNote}}'
            + ' in {{secondHostCell}}, {{firstURNote}} in {{thirdHostCell}} and {{secondURNote}} in {{fourthHostCell}}.'
            + ' And second way is to fill {{secondURNote}} in {{firstHostCell}}, {{firstURNote}}'
            + ' in {{secondHostCell}}, {{secondURNote}} in {{thirdHostCell}} and {{firstURNote}} in {{fourthHostCell}}.'
            + ' This is not possible since this puzzle has only one solution.'
            + '</p>',
            '<p>'
            + 'So conclusion is that either in {{firstCellWithExtraCandidates}} {{firstCellExtraCandidates}}'
            + ' has to come or in {{secondCellWithExtraCandidates}} {{secondCellExtraCandidates}} has to come.'
            + ' Whichever is the case, either {{firstNGCells}} will make a {{ngHintText}} or {{secondNGCells}} will make a {{ngHintText}}.'
            + ' And due to this we can remove the numbers highlighted in red color.'
            + '</p>'
        ],
        [UR_TYPES.TYPE_FOUR]: [
            `<p>Notice that {{omissonNote}} is making an ${getLinkHTMLText(HINTS_VOCAB_IDS.OMISSION, 'Omission')} in {{omissionHostHouse}}.`
            + ' It means that {{omissonNote}} has to come in one of {{cellsWithExtraCandidatesOrConcat}}. And if {{removableNote}} also come in {{cellsWithExtraCandidatesOrConcat}}'
            + ' then it will result in two ways to fill these 4 cells without impacting other cells in any way.'
            + '<br/>'
            + 'One way is to fill {{firstURNote}} in {{firstHostCell}}, {{secondURNote}}'
            + ' in {{secondHostCell}}, {{firstURNote}} in {{thirdHostCell}} and {{secondURNote}} in {{fourthHostCell}}.'
            + ' And second way is to fill {{secondURNote}} in {{firstHostCell}}, {{firstURNote}}'
            + ' in {{secondHostCell}}, {{secondURNote}} in {{thirdHostCell}} and {{firstURNote}} in {{fourthHostCell}}'
            + '</p>',
            '<p>This puzzle has only one valid solution so it is impossible to fill all of these 4 cells with just {{firstURNote}} and {{secondURNote}}.'
            + ' So only option left is to remove {{removableNote}} from {{cellsWithExtraCandidatesAndConcat}} because of two reasons. First, {{omissonNote}} will definitely come in'
            + ` one of {{cellsWithExtraCandidatesOrConcat}} and second, {{firstURNote}} and {{secondURNote}} make a ${getLinkHTMLText(HINTS_VOCAB_IDS.NAKED_DOUBLE, 'Naked Double')}`
            + ' in {{cellsHavingOnlyURNotes}} cells so {{firstURNote}} and {{secondURNote}} both will definitely come in these two cells.'
            + '</p>'
        ],
        [UR_TYPES.TYPE_SIX]: [
            '<p>'
            + 'If in {{cellsWithExtraCandidateList}} only {{urNotes}} comes then this puzzle will have two solutions.'
            + ' One way is to fill {{firstURNote}} in {{firstHostCell}}, {{secondURNote}}'
            + ' in {{secondHostCell}}, {{firstURNote}} in {{thirdHostCell}} and {{secondURNote}} in {{fourthHostCell}}.'
            + ' And second way is to fill {{secondURNote}} in {{firstHostCell}}, {{firstURNote}}'
            + ' in {{secondHostCell}}, {{secondURNote}} in {{thirdHostCell}} and {{firstURNote}} in {{fourthHostCell}}.'
            + ' But this puzzle has only one solution so these 4 cells can not be filled with just {{urNotes}}.'
            + '</p>',
            '<p>'
            + 'Now there are two options to avoid the impossible scenario, either {{firstCellWithExtraCandidates}} gets filled by {{extraCandidatesInFirstCell}}'
            + ' or {{secondCellWithExtraCandidates}} gets filled by {{extraCandidatesInSecondCell}}. Or both of these might be true as well.'
            + ' In all of these options there is one thing that will always be true, {{removableCandidate}} will be removed from {{cellsWithExtraCandidateList}}.'
            + ` Notice that {{xWingCandidate}} makes an ${getLinkHTMLText(HINTS_VOCAB_IDS.PERFECT_X_WING, 'X-Wing')} in {{rowHostHouses}} and {{columnHostHouses}}.`
            + ' This is the key to understand this.'
            + '</p>',
            '<p>'
            + 'If {{extraCandidatesInFirstCell}} fills {{firstCellWithExtraCandidates}} then <b>{{urHostCellInSameRowWithFirstCellWithExtraCandidates}} and'
            + ' {{urHostCellInSameColWithFirstCellWithExtraCandidates}}</b> are the only cells in {{firstCellWithExtraCandidatesRowHouse}} and {{firstCellWithExtraCandidatesColumnHouse}}'
            + ' respectively where {{xWingCandidate}} can come.'
            + ' And If {{extraCandidatesInSecondCell}} fills {{secondCellWithExtraCandidates}} then <b>{{urHostCellInSameRowWithSecondCellWithExtraCandidates}} and'
            + ' {{urHostCellInSameColWithSecondCellWithExtraCandidates}}</b> are the only cells in {{secondCellWithExtraCandidatesRowHouse}} and {{secondCellWithExtraCandidatesColumnHouse}}'
            + ' respectively where {{xWingCandidate}} can come.'
            + ' In both the cases {{xWingCandidate}} will be filled in <b>{{cellsHavingOnlyURNotes}}</b>, so we can remove {{xWingCandidate}} from {{cellsWithExtraCandidateList}}.'
            + '</p>',
        ],
    }
}

export const COMPOSITE_HINT_EXPLANATION_TEXTS = {
    [HINTS_IDS.NAKED_SINGLE]:
        '<p>except {{solutionValue}} no other number from 1-9 can come in {{cellAxesText}}, so'
        + ' only {{solutionValue}} can come in {{cellAxesText}}.</p>'
    ,
    [HINTS_IDS.HIDDEN_SINGLE]:
        '<p>in the highlighted {{houseType}}, {{solutionValue}} can\'t come in any other'
        + ` ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cells')} except {{hostCell}} so in {{hostCell}} only {{solutionValue}} will come</p>`
}
