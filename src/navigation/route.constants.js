const DESIGN_SYSTEM_ROUTES = {
    DESIGN_SYSTEM: 'design_system',
    BADGE: 'badge',
    TYPOGRAPHY: 'typography',
    BUTTON: 'button',
    DIVIDER: 'divider',
}

export const ROUTES = {
    HOME: 'home',
    ARENA: 'arena',
    SOME_PAGE: 'somepage',
    PLAY_GUIDE: 'play_guide',
    ...DESIGN_SYSTEM_ROUTES,
}

// TODO: separate out the header and route constants here in this file
export const HEADER_SECTION = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
}

export const HEADER_ITEMS = {
    BACK: 'BACK',
    SETTINGS: 'SETTINGS',
    SHARE: 'SHARE',
}

export const ROUTE_HEADER_TITLES = {
    [ROUTES.PLAY_GUIDE]: 'How To Play?',
    [ROUTES.DESIGN_SYSTEM]: 'Design System',
    [ROUTES.BADGE]: 'Badge',
    [ROUTES.TYPOGRAPHY]: 'Typography',
    [ROUTES.BUTTON]: 'Button',
    [ROUTES.DIVIDER]: 'Divder',
}

// todo: we should change it's name as these keys will be defined in
//      navigation params only
export const HEADER_ITEMS_PRESS_HANDLERS_KEYS = {
    [HEADER_ITEMS.BACK]: 'ON_BACK_PRESS',
    [HEADER_ITEMS.SETTINGS]: 'ON_SETTINGS_PRESS',
    [HEADER_ITEMS.SHARE]: 'ON_SHARE_PRESS',
}
