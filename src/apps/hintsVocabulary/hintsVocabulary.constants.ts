import { TFunction } from 'i18next'
import { HINTS_VOCAB_IDS } from '../arena/utils/smartHints/rawHintTransformers'

export const NAVIGATION_PARAMS = {
    VOCAB_KEYWORD: 'vocabKeyword',
}

export const getHintsVocabTitle = (t: TFunction) => ({
    [HINTS_VOCAB_IDS.CANDIDATE]: t('hintsVocabulary:titles.candidate'),
    [HINTS_VOCAB_IDS.HOUSE]: t('hintsVocabulary:titles.house'),
    [HINTS_VOCAB_IDS.CELL]: t('hintsVocabulary:titles.cell'),
    [HINTS_VOCAB_IDS.ROW]: t('hintsVocabulary:titles.row'),
    [HINTS_VOCAB_IDS.COLUMN]: t('hintsVocabulary:titles.column'),
    [HINTS_VOCAB_IDS.BLOCK]: t('hintsVocabulary:titles.block'),
    [HINTS_VOCAB_IDS.NAKED_SINGLE]: t('hintsVocabulary:titles.nakedSingle'),
    [HINTS_VOCAB_IDS.NAKED_DOUBLE]: t('hintsVocabulary:titles.nakedDouble'),
    [HINTS_VOCAB_IDS.NAKED_TRIPPLE]: t('hintsVocabulary:titles.nakedTripple'),
    [HINTS_VOCAB_IDS.HIDDEN_SINGLE]: t('hintsVocabulary:titles.hiddenSingle'),
    [HINTS_VOCAB_IDS.HIDDEN_DOUBLE]: t('hintsVocabulary:titles.hiddenDouble'),
    [HINTS_VOCAB_IDS.HIDDEN_TRIPPLE]: t('hintsVocabulary:titles.hiddenTripple'),
    [HINTS_VOCAB_IDS.OMISSION]: t('hintsVocabulary:titles.omission'),
    [HINTS_VOCAB_IDS.CHAIN]: t('hintsVocabulary:titles.chain'),
    [HINTS_VOCAB_IDS.CHAIN_LINKS]: t('hintsVocabulary:titles.chainLinks'),
    [HINTS_VOCAB_IDS.REMOTE_PAIRS]: t('hintsVocabulary:titles.remotePairs'),
    [HINTS_VOCAB_IDS.X_CHAIN]: t('hintsVocabulary:titles.xChain'),
    [HINTS_VOCAB_IDS.XY_CHAIN]: t('hintsVocabulary:titles.xyChain'),
    [HINTS_VOCAB_IDS.PERFECT_X_WING]: t('hintsVocabulary:titles.perfectXWing'),
    [HINTS_VOCAB_IDS.FINNED_X_WING]: t('hintsVocabulary:titles.finnedXWing'),
    [HINTS_VOCAB_IDS.SASHIMI_FINNED_X_WING]: t('hintsVocabulary:titles.sashimiFinnedXWing'),
    [HINTS_VOCAB_IDS.X_WING_CORNER_CELLS]: t('hintsVocabulary:titles.xWingCornerCells'),
    [HINTS_VOCAB_IDS.X_WING_FINN_CELLS]: t('hintsVocabulary:titles.xWingFinnCells'),
    [HINTS_VOCAB_IDS.EMPTY_RECTANGLE]: t('hintsVocabulary:titles.emptyRectangle'),
})

const zoomOneBlockContainerDimensions = {
    x: 136,
    y: 136
}
const zoomTwoBlockContainerDimensions = {
    x: 2 * 136,
    y: 2 * 136
}
export const blockContainerShifts = {
    1: { x: 114, y: 114 },
    2: { x: 0, y: 114 },
    3: { x: -114, y: 114 },
    4: { x: 114, y: 0 },
    5: { x: 0, y: 0 },
    6: { x: -114, y: 0 },
    7: { x: 114, y: -114 },
    8: { x: 0, y: -114 },
    9: { x: -114, y: -114 }
}

const zoomOneRowContainerDimensions = {
    height: 48
}
const zoomTwoRowContainerDimensions = {
    height: 2 * 48
}
export const rowContainerShifts = {
    1: { x: 0, y: 152 },
    2: { x: 0, y: 114 },
    3: { x: 0, y: 76 },
    4: { x: 0, y: 38 },
    5: { x: 0, y: 0 },
    6: { x: 0, y: -38 },
    7: { x: 0, y: -76 },
    8: { x: 0, y: -114 },
    9: { x: 0, y: -152 }
}

const zoomOneColumnContainerDimensions = {
    width: 48
}
const zoomTwoColumnContainerDimensions = {
    width: 2 * 48
}
export const columnContainerShifts = {
    1: { x: 152, y: 0 },
    2: { x: 114, y: 0 },
    3: { x: 76, y: 0 },
    4: { x: 38, y: 0 },
    5: { x: 0, y: 0 },
    6: { x: -38, y: 0 },
    7: { x: -76, y: 0 },
    8: { x: -114, y: 0 },
    9: { x: -152, y: 0 }
}
