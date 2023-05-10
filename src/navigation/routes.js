import { Arena } from '../apps/arena'
import { Home } from '../apps/home'
import { PlayGuide } from '../apps/playGuide'
import DesignSystem from '../apps/designSystemScreen'
import Badge from '../apps/designSystemScreen/componentsScreens/Badge'

import { TempScreen } from '../apps/vocabularyExplaination/temp'

import {
    HEADER_ITEMS,
    HEADER_SECTION,
    ROUTES,
    ROUTE_HEADER_TITLES,
} from './route.constants'

const DESIGN_SYSTEM_SCREENS = [
    {
        name: ROUTES.DESIGN_SYSTEM,
        component: DesignSystem,
        headerItems: {
            title: ROUTE_HEADER_TITLES[ROUTES.DESIGN_SYSTEM],
            [HEADER_SECTION.LEFT]: [HEADER_ITEMS.BACK],
        },
    },
    {
        name: ROUTES.BADGE,
        component: Badge,
        headerItems: {
            title: ROUTE_HEADER_TITLES[ROUTES.BADGE],
            [HEADER_SECTION.LEFT]: [HEADER_ITEMS.BACK],
        },
    },
]

export const routes = [
    {
        name: ROUTES.HOME,
        component: Home,
        headerItems: {
            [HEADER_SECTION.RIGHT]: [HEADER_ITEMS.SETTINGS],
        },
    },
    {
        name: ROUTES.ARENA,
        component: Arena,
        headerItems: {
            [HEADER_SECTION.LEFT]: [HEADER_ITEMS.BACK],
            [HEADER_SECTION.RIGHT]: [HEADER_ITEMS.SHARE],
        },
    },
    {
        name: ROUTES.PLAY_GUIDE,
        component: PlayGuide,
        headerItems: {
            title: ROUTE_HEADER_TITLES[ROUTES.PLAY_GUIDE],
            [HEADER_SECTION.LEFT]: [HEADER_ITEMS.BACK],
        },
    },
    {
        name: ROUTES.SOME_PAGE,
        component: TempScreen,
        headerItems: {
            [HEADER_SECTION.LEFT]: [HEADER_ITEMS.BACK],
        },
    },
    ...DESIGN_SYSTEM_SCREENS,
]

// TODO: write testcases for it
export const routesHeaderItems = routes.reduce((acc, route) => {
    const { name, headerItems } = route
    acc[name] = headerItems
    return acc
}, {})
