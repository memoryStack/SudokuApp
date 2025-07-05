export enum DESIGN_SYSTEM_ROUTES {
    DESIGN_SYSTEM = 'design_system',
    BADGE = 'badge',
    TYPOGRAPHY = 'typography',
    BUTTON = 'button',
    DIVIDER = 'divider',
    DIALOG = 'dialog',
    LEVEL_CARD = 'level_card',
}

export enum ROUTES {
    HOME = 'home',
    ARENA = 'arena',
    PLAY_GUIDE = 'play_guide',
    HINTS_VOCABULARY_EXPLAINATION = 'hints_vocabulary_explaination',
    LEVELS = 'levels',
    GAME_SETTINGS = 'game_settings',
    DESIGN_SYSTEM = DESIGN_SYSTEM_ROUTES.DESIGN_SYSTEM,
    BADGE = DESIGN_SYSTEM_ROUTES.BADGE,
    TYPOGRAPHY = DESIGN_SYSTEM_ROUTES.TYPOGRAPHY,
    BUTTON = DESIGN_SYSTEM_ROUTES.BUTTON,
    DIVIDER = DESIGN_SYSTEM_ROUTES.DIVIDER,
    DIALOG = DESIGN_SYSTEM_ROUTES.DIALOG,
    LEVEL_CARD = DESIGN_SYSTEM_ROUTES.LEVEL_CARD,
}

export const ROUTE_HEADER_TITLES = {
    [ROUTES.PLAY_GUIDE]: 'How To Play?',
    [ROUTES.GAME_SETTINGS]: 'Customize Experience',
    [ROUTES.DESIGN_SYSTEM]: 'Design System',
    [ROUTES.BADGE]: 'Badge',
    [ROUTES.TYPOGRAPHY]: 'Typography',
    [ROUTES.BUTTON]: 'Button',
    [ROUTES.DIVIDER]: 'Divder',
    [ROUTES.DIALOG]: 'Dialog',
    [ROUTES.LEVEL_CARD]: 'Level Card',
    [ROUTES.LEVELS]: 'Choose Your Game',
}
