import { COLOR_SCHEME_STYLES as boardColorStyles } from '../../gameBoard/style'

const UI_HINTS_COUNT_THRESHOLD = 1

const HOUSE_TYPE = {
    ROW: 'row',
    COL: 'col',
    BLOCK: 'block',
}

const NAKED_SINGLE_TYPES = {
    ...HOUSE_TYPE,
    MIX: 'mix',
}

const HIDDEN_SINGLE_TYPES = {
    ...HOUSE_TYPE,
}

const GROUPS = {
    NAKED_GROUP: 'NAKED_GROUP',
    HIDDEN_GROUP: 'HIDDEN_GROUP',
}

/*
    TODO: come upp with better colors later on
    let's focus on the functionality for now
*/
const SMART_HINTS_CELLS_BG_COLOR = {
    SELECTED: boardColorStyles.selectedCellBGColor,
    IN_FOCUS_DEFAULT: boardColorStyles.defaultCellBGColor,
}

const NUMBER_TO_TEXT = {
    2: 'two',
    3: 'three',
}

const HINTS_IDS = {
    NAKED_SINGLE: 'NAKED_SINGLE',
    HIDDEN_SINGLE: 'HIDDEN_SINGLE',
    NAKED_DOUBLE: 'NAKED_DOUBLE',
    HIDDEN_DOUBLE: 'HIDDEN_DOUBLE',
    NAKED_TRIPPLE: 'NAKED_TRIPPLE',
    HIDDEN_TRIPPLE: 'HIDDEN_TRIPPLE',
    X_WING: 'X_WING',
    PERFECT_X_WING: 'PERFECT_X_WING',
    FINNED_X_WING: 'FINNED_X_WING',
    SASHIMI_FINNED_X_WING: 'SASHIMI_FINNED_X_WING',
    Y_WING: 'Y_WING',
    OMISSION: 'OMISSION',
    ALL: 'ALL',
}

const INDEPENDENT_HINTS_MENU_ITEMS = [
    {
        label: 'Naked\nSingle',
        id: HINTS_IDS.NAKED_SINGLE,
    },
    {
        label: 'Hidden\nSingle',
        id: HINTS_IDS.HIDDEN_SINGLE,
    },
    {
        label: 'Omission',
        id: HINTS_IDS.OMISSION,
    },
    {
        label: 'Naked\nDouble',
        id: HINTS_IDS.NAKED_DOUBLE,
    },
    {
        label: 'Hidden\nDouble',
        id: HINTS_IDS.HIDDEN_DOUBLE,
    },
    {
        label: 'Naked\nTripple',
        id: HINTS_IDS.NAKED_TRIPPLE,
    },
    {
        label: 'Hidden\nTripple',
        id: HINTS_IDS.HIDDEN_TRIPPLE,
    },
    {
        label: 'X-Wing',
        id: HINTS_IDS.X_WING,
    },
    {
        label: 'Y-Wing',
        id: HINTS_IDS.Y_WING,
    },
]

const HINTS_MENU_ITEMS = [
    ...INDEPENDENT_HINTS_MENU_ITEMS,
    {
        label: 'All',
        id: HINTS_IDS.ALL,
    },
]

const NO_HINTS_FOUND_POPUP_TEXT = {
    [HINTS_IDS.NAKED_SINGLE]: 'naked singles',
    [HINTS_IDS.HIDDEN_SINGLE]: 'hidden singles',
    [HINTS_IDS.NAKED_DOUBLE]: 'naked doubles',
    [HINTS_IDS.HIDDEN_DOUBLE]: 'hidden doubles',
    [HINTS_IDS.NAKED_TRIPPLE]: 'naked tripples',
    [HINTS_IDS.HIDDEN_TRIPPLE]: 'hidden tripples',
    [HINTS_IDS.X_WING]: 'x-wings',
    [HINTS_IDS.Y_WING]: 'y-wings',
    [HINTS_IDS.OMISSION]: 'Omissions',
    [HINTS_IDS.ALL]: 'hints',
}

const HINT_TEXT_ELEMENTS_JOIN_CONJUGATION = {
    AND: 'and',
    OR: 'or',
}

const HOUSE_TYPE_VS_FULL_NAMES = {
    [HOUSE_TYPE.ROW]: {
        FULL_NAME: 'row',
        FULL_NAME_PLURAL: 'rows',
    },
    [HOUSE_TYPE.COL]: {
        FULL_NAME: 'column',
        FULL_NAME_PLURAL: 'columns',
    },
    [HOUSE_TYPE.BLOCK]: {
        FULL_NAME: 'block',
        FULL_NAME_PLURAL: 'blocks',
    },
}

export {
    NAKED_SINGLE_TYPES,
    HIDDEN_SINGLE_TYPES,
    GROUPS,
    SMART_HINTS_CELLS_BG_COLOR,
    NUMBER_TO_TEXT,
    HOUSE_TYPE,
    HINTS_MENU_ITEMS,
    HINTS_IDS,
    INDEPENDENT_HINTS_MENU_ITEMS,
    NO_HINTS_FOUND_POPUP_TEXT,
    UI_HINTS_COUNT_THRESHOLD,
    HINT_TEXT_ELEMENTS_JOIN_CONJUGATION,
    HOUSE_TYPE_VS_FULL_NAMES,
}
