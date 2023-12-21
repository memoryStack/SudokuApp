const DESIGN_SYSTEM_ROUTES = {
    DESIGN_SYSTEM: 'design_system',
    BADGE: 'badge',
    TYPOGRAPHY: 'typography',
    BUTTON: 'button',
    DIVIDER: 'divider',
    DIALOG: 'dialog',
}

export const ROUTES = {
    HOME: 'home',
    ARENA: 'arena',
    SOME_PAGE: 'somepage',
    PLAY_GUIDE: 'play_guide',
    HINTS_VOCABULARY_EXPLAINATION: 'hints_vocabulary_explaination',
    ...DESIGN_SYSTEM_ROUTES,
}

export const ROUTE_HEADER_TITLES = {
    [ROUTES.PLAY_GUIDE]: 'How To Play?',
    [ROUTES.DESIGN_SYSTEM]: 'Design System',
    [ROUTES.BADGE]: 'Badge',
    [ROUTES.TYPOGRAPHY]: 'Typography',
    [ROUTES.BUTTON]: 'Button',
    [ROUTES.DIVIDER]: 'Divder',
    [ROUTES.DIALOG]: 'Dialog',
}
