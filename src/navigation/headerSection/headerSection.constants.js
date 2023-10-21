export const ICON_DIMENSION = 32

export const HEADER_HORIZONTAL_MARGIN = 8

export const HEADER_SECTION = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
}

export const HEADER_ITEMS = {
    BACK: 'BACK',
    SETTINGS: 'SETTINGS',
    SHARE: 'SHARE',
}

// not added for settings, that's handled locally in the component
export const HEADER_ITEM_VS_TEST_ID = {
    [HEADER_ITEMS.BACK]: 'header_back_arrow_test_id',
    [HEADER_ITEMS.SHARE]: 'header_share_test_id',
}

export const HEADER_ITEMS_PRESS_HANDLERS_KEYS = {
    [HEADER_ITEMS.BACK]: 'ON_BACK_PRESS',
    [HEADER_ITEMS.SETTINGS]: 'ON_SETTINGS_PRESS',
    [HEADER_ITEMS.SHARE]: 'ON_SHARE_PRESS',
}
