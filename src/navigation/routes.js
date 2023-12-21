import { Arena } from '../apps/arena'
import { Home } from '../apps/home'
import { PlayGuide } from '../apps/playGuide'
import HintsVocabulary from '../apps/hintsVocabulary'
import DesignSystem from '../apps/designSystemScreen'
import Badge from '../apps/designSystemScreen/componentsScreens/Badge'
import Typography from '../apps/designSystemScreen/componentsScreens/Typography'
import Button from '../apps/designSystemScreen/componentsScreens/Button'
import Divider from '../apps/designSystemScreen/componentsScreens/Divider'
import Dialog from '../apps/designSystemScreen/componentsScreens/Dialog'

import { TempScreen } from '../apps/vocabularyExplaination/temp'

import { HEADER_ITEMS, HEADER_SECTION } from './headerSection/headerSection.constants'

import {
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
    {
        name: ROUTES.TYPOGRAPHY,
        component: Typography,
        headerItems: {
            title: ROUTE_HEADER_TITLES[ROUTES.TYPOGRAPHY],
            [HEADER_SECTION.LEFT]: [HEADER_ITEMS.BACK],
        },
    },
    {
        name: ROUTES.BUTTON,
        component: Button,
        headerItems: {
            title: ROUTE_HEADER_TITLES[ROUTES.BUTTON],
            [HEADER_SECTION.LEFT]: [HEADER_ITEMS.BACK],
        },
    },
    {
        name: ROUTES.DIVIDER,
        component: Divider,
        headerItems: {
            title: ROUTE_HEADER_TITLES[ROUTES.DIVIDER],
            [HEADER_SECTION.LEFT]: [HEADER_ITEMS.BACK],
        },
    },
    {
        name: ROUTES.DIALOG,
        component: Dialog,
        headerItems: {
            title: ROUTE_HEADER_TITLES[ROUTES.DIALOG],
            [HEADER_SECTION.LEFT]: [HEADER_ITEMS.BACK],
        },
    },
]

export const routes = [
    {
        name: ROUTES.HOME,
        component: Home,
        headerItems: {
            [HEADER_SECTION.RIGHT]: __DEV__ ? [HEADER_ITEMS.SETTINGS] : [],
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
        name: ROUTES.HINTS_VOCABULARY_EXPLAINATION,
        component: HintsVocabulary,
        headerItems: {
            title: ROUTE_HEADER_TITLES[ROUTES.HINTS_VOCABULARY_EXPLAINATION],
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
