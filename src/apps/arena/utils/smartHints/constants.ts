const HOUSE_TYPE = {
    ROW: 'row',
    COL: 'col',
    BLOCK: 'block',
}

enum NAKED_SINGLE_TYPES {
    ROW = 'row',
    COL = 'col',
    BLOCK = 'block',
    MIX = 'mix',
}

enum HIDDEN_SINGLE_TYPES {
    ROW = 'row',
    COL = 'col',
    BLOCK = 'block',
}

const NUMBER_TO_TEXT = {
    2: 'two',
    3: 'three',
}

enum HINTS_IDS {
    NAKED_SINGLE = 'NAKED_SINGLE',
    HIDDEN_SINGLE = 'HIDDEN_SINGLE',
    NAKED_DOUBLE = 'NAKED_DOUBLE',
    HIDDEN_DOUBLE = 'HIDDEN_DOUBLE',
    NAKED_TRIPPLE = 'NAKED_TRIPPLE',
    HIDDEN_TRIPPLE = 'HIDDEN_TRIPPLE',
    X_WING = 'X_WING',
    PERFECT_X_WING = 'PERFECT_X_WING',
    FINNED_X_WING = 'FINNED_X_WING',
    SASHIMI_FINNED_X_WING = 'SASHIMI_FINNED_X_WING',
    Y_WING = 'Y_WING',
    OMISSION = 'OMISSION',
    REMOTE_PAIRS = 'REMOTE_PAIRS',
    EMPTY_RECTANGLE = 'EMPTY_RECTANGLE',
    X_CHAIN = 'X_CHAIN',
    XY_CHAIN = 'XY_CHAIN',
    W_WING = 'W_WING',
    XYZ_WING = 'XYZ_WING',
    ALL = 'ALL',
}

const HINT_LABELS = {
    [HINTS_IDS.NAKED_SINGLE]: 'Naked\nSingle',
    [HINTS_IDS.HIDDEN_SINGLE]: 'Hidden\nSingle',
    [HINTS_IDS.NAKED_DOUBLE]: 'Naked\nDouble',
    [HINTS_IDS.HIDDEN_DOUBLE]: 'Hidden\nDouble',
    [HINTS_IDS.NAKED_TRIPPLE]: 'Naked\nTripple',
    [HINTS_IDS.HIDDEN_TRIPPLE]: 'Hidden\nTripple',
    [HINTS_IDS.X_WING]: 'X-Wing',
    [HINTS_IDS.Y_WING]: 'Y-Wing',
    [HINTS_IDS.OMISSION]: 'Omission',
    [HINTS_IDS.REMOTE_PAIRS]: 'Remote Pairs',
    [HINTS_IDS.EMPTY_RECTANGLE]: 'Empty Rectangle',
    [HINTS_IDS.X_CHAIN]: 'X-Chain',
    [HINTS_IDS.XY_CHAIN]: 'XY-Chain',
    [HINTS_IDS.W_WING]: 'W-Wing',
    [HINTS_IDS.XYZ_WING]: 'XYZ-Wing'
}

const HINTS_MENU_ITEMS = [
    {
        label: HINT_LABELS[HINTS_IDS.NAKED_SINGLE],
        id: HINTS_IDS.NAKED_SINGLE,
    },
    {
        label: HINT_LABELS[HINTS_IDS.HIDDEN_SINGLE],
        id: HINTS_IDS.HIDDEN_SINGLE,
    },
    {
        label: HINT_LABELS[HINTS_IDS.OMISSION],
        id: HINTS_IDS.OMISSION,
    },
    {
        label: HINT_LABELS[HINTS_IDS.NAKED_DOUBLE],
        id: HINTS_IDS.NAKED_DOUBLE,
    },
    {
        label: HINT_LABELS[HINTS_IDS.HIDDEN_DOUBLE],
        id: HINTS_IDS.HIDDEN_DOUBLE,
    },
    {
        label: HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE],
        id: HINTS_IDS.NAKED_TRIPPLE,
    },
    {
        label: HINT_LABELS[HINTS_IDS.HIDDEN_TRIPPLE],
        id: HINTS_IDS.HIDDEN_TRIPPLE,
    },
    {
        label: HINT_LABELS[HINTS_IDS.X_WING],
        id: HINTS_IDS.X_WING,
    },
    {
        label: HINT_LABELS[HINTS_IDS.Y_WING],
        id: HINTS_IDS.Y_WING,
    },
    {
        label: HINT_LABELS[HINTS_IDS.EMPTY_RECTANGLE],
        id: HINTS_IDS.EMPTY_RECTANGLE,
    },
    {
        label: HINT_LABELS[HINTS_IDS.REMOTE_PAIRS],
        id: HINTS_IDS.REMOTE_PAIRS,
    },
    {
        label: HINT_LABELS[HINTS_IDS.X_CHAIN],
        id: HINTS_IDS.X_CHAIN,
    },
    {
        label: HINT_LABELS[HINTS_IDS.XY_CHAIN],
        id: HINTS_IDS.XY_CHAIN,
    },
    {
        label: HINT_LABELS[HINTS_IDS.W_WING],
        id: HINTS_IDS.W_WING,
    },
    {
        label: HINT_LABELS[HINTS_IDS.XYZ_WING],
        id: HINTS_IDS.XYZ_WING,
    },
]

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
    NUMBER_TO_TEXT,
    HOUSE_TYPE,
    HINTS_MENU_ITEMS,
    HINTS_IDS,
    HINT_LABELS,
    HINT_TEXT_ELEMENTS_JOIN_CONJUGATION,
    HOUSE_TYPE_VS_FULL_NAMES,
}
