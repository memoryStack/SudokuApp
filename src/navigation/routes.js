
import { Arena } from '../apps/arena'
import { Home } from '../apps/home'
import { PlayGuide } from '../apps/playGuide'
import { TempScreen } from '../apps/vocabularyExplaination/temp'

import { ROUTES } from './route.constants'

export const routes = [
    {
        name: ROUTES.HOME,
        component: Home,
        headerItems: {
            // right header
            // left header
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
