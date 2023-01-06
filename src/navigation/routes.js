
import { Arena } from '../apps/arena'
import { Home } from '../apps/home'
import { PlayGuide } from '../apps/playGuide'
import { TempScreen } from '../apps/vocabularyExplaination/temp'

import { HEADER_ITEMS, HEADER_SECTION, ROUTES } from './route.constants'

export const routes = [
    {
        name: ROUTES.HOME,
        component: Home,
        headerItems: {
            [HEADER_SECTION.RIGHT]: [HEADER_ITEMS.SETTINGS]
        }
    },
    {
        name: ROUTES.ARENA,
        component: Arena,
    },
    {
        name: ROUTES.PLAY_GUIDE,
        component: PlayGuide,
    },
    {
        name: ROUTES.SOME_PAGE,
        component: TempScreen,
    },
]

// TODO: write testcases for it
export const routesHeaderItems = routes.reduce((acc, route) => {
    const { name, headerItems } = route
    acc[name] = headerItems
    return acc
}, {})
