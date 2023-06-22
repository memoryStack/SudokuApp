import { HEADER_ITEMS } from './headerSection/headerSection.constants'

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

export const ROUTE_HEADER_TITLES = {
    [ROUTES.PLAY_GUIDE]: 'How To Play?',
    [ROUTES.DESIGN_SYSTEM]: 'Design System',
    [ROUTES.BADGE]: 'Badge',
    [ROUTES.TYPOGRAPHY]: 'Typography',
    [ROUTES.BUTTON]: 'Button',
    [ROUTES.DIVIDER]: 'Divder',
}
