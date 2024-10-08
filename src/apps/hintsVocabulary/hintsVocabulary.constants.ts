import { HINTS_VOCAB_IDS } from '../arena/utils/smartHints/rawHintTransformers'

export const NAVIGATION_PARAMS = {
    VOCAB_KEYWORD: 'vocabKeyword',
}

export const HINTS_VOCAB_TITLE = {
    [HINTS_VOCAB_IDS.CANDIDATE]: 'Candidate',
    [HINTS_VOCAB_IDS.HOUSE]: 'House',
    [HINTS_VOCAB_IDS.CELL]: 'Cell',
    [HINTS_VOCAB_IDS.ROW]: 'Row',
    [HINTS_VOCAB_IDS.COLUMN]: 'Column',
    [HINTS_VOCAB_IDS.BLOCK]: 'Block',
    [HINTS_VOCAB_IDS.NAKED_SINGLE]: 'Naked Single',
    [HINTS_VOCAB_IDS.NAKED_DOUBLE]: 'Naked Double',
    [HINTS_VOCAB_IDS.NAKED_TRIPPLE]: 'Naked Tripple',
    [HINTS_VOCAB_IDS.HIDDEN_SINGLE]: 'Hidden Single',
    [HINTS_VOCAB_IDS.HIDDEN_DOUBLE]: 'Hidden Double',
    [HINTS_VOCAB_IDS.HIDDEN_TRIPPLE]: 'Hidden Tripple',
    [HINTS_VOCAB_IDS.OMISSION]: 'Omission',
    [HINTS_VOCAB_IDS.CHAIN]: 'Chain',
    [HINTS_VOCAB_IDS.CHAIN_LINKS]: 'Chain Links',
    [HINTS_VOCAB_IDS.REMOTE_PAIRS]: 'Remote Pairs',
    [HINTS_VOCAB_IDS.X_CHAIN]: 'X-Chain',
    [HINTS_VOCAB_IDS.XY_CHAIN]: 'XY-Chain',
    [HINTS_VOCAB_IDS.PERFECT_X_WING]: 'X-Wing',
    [HINTS_VOCAB_IDS.FINNED_X_WING]: 'Finned X-Wing',
    [HINTS_VOCAB_IDS.SASHIMI_FINNED_X_WING]: 'Sashimi Finned X-Wing',
    [HINTS_VOCAB_IDS.X_WING_CORNER_CELLS]: 'X-Wing Corner Cells',
    [HINTS_VOCAB_IDS.X_WING_FINN_CELLS]: 'X-Wing Finn Cells',
    [HINTS_VOCAB_IDS.EMPTY_RECTANGLE]: 'Empty Rectangle',
}

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
