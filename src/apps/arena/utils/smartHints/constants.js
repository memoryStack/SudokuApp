import { Styles as boardStyles } from '../../gameBoard/style'

const NAKED_SINGLE_TYPES = {
    ROW: 'row',
    COL: 'col',
    BLOCK: 'block',
    MIX: 'mix',
}

const HIDDEN_SINGLE_TYPES = {
    ROW: 'row',
    COL: 'col',
    BLOCK: 'block',
}

// TODO: above 3 constans are kind of same
const HOUSE_TYPE = {
    ROW: 'row',
    COL: 'col',
    BLOCK: 'block',
}

/*
    TODO: come upp with better colors later on
    let's focus on the functionality for now
*/
const SMART_HINTS_CELLS_BG_COLOR = {
    SELECTED: boardStyles.selectedCellBGColor,
    IN_FOCUS_DEFAULT: boardStyles.defaultCellBGColor,
}

const NUMBER_TO_TEXT = {
    2: 'two',
    3: 'three',
}

const HIDDEN_GROUP_TYPE = {
    2: 'Hidden Double',
    3: 'Hidden Tripple',
}

const HINTS_IDS = {
    NAKED_SINGLE: 'NAKED_SINGLE',
    HIDDEN_SINGLE: 'HIDDEN_SINGLE',
    NAKED_DOUBLE: 'NAKED_DOUBLE',
    HIDDEN_DOUBLE: 'HIDDEN_DOUBLE',
    NAKED_TRIPPLE: 'NAKED_TRIPPLE',
    HIDDEN_TRIPPLE: 'HIDDEN_TRIPPLE',
    X_WING: 'X_WING',
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
    }
]

const HINTS_MENU_ITEMS = [
    ...INDEPENDENT_HINTS_MENU_ITEMS,
    {
        label: 'All',
        id: HINTS_IDS.ALL,
    },
]

export {
    NAKED_SINGLE_TYPES,
    HIDDEN_SINGLE_TYPES,
    SMART_HINTS_CELLS_BG_COLOR,
    NUMBER_TO_TEXT,
    HIDDEN_GROUP_TYPE,
    HOUSE_TYPE,
    HINTS_MENU_ITEMS,
    HINTS_IDS,
    INDEPENDENT_HINTS_MENU_ITEMS,
}
