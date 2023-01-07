export const ROUTES = {
    HOME: 'home',
    ARENA: 'arena',
    SOME_PAGE: 'somepage',
    PLAY_GUIDE: 'play_guide',
}

export const HEADER_SECTION = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
}

export const HEADER_ITEMS = {
    BACK: 'BACK',
    SETTINGS: 'SETTINGS',
    SHARE: 'SHARE',
}

// todo: we should change it's name as these keys will be defined in 
//      navigation params only
export const HEADER_ITEMS_PRESS_HANDLERS_KEYS = {
    [HEADER_ITEMS.BACK]: 'ON_BACK_PRESS',
    [HEADER_ITEMS.SETTINGS]: 'ON_SETTINGS_PRESS',
    [HEADER_ITEMS.SHARE]: 'ON_SHARE_PRESS',
}
