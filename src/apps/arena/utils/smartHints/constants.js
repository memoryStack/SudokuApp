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

const HINTS_MENU_ITEMS = [
    {
        label: 'Naked\nSingle',
        code: 0,
    },
    {
        label: 'Hidden\nSingle',
        code: 1,
    },
    {
        label: 'Naked\nDouble',
        code: 2,
    },
    {
        label: 'Hidden\nDouble',
        code: 3,
    },
    {
        label: 'Naked\nTripple',
        code: 4,
    },
    {
        label: 'Hidden\nTripple',
        code: 5,
    },
    {
        label: 'All',
        code: -1,
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
}
