import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import { Arena } from '../apps/arena'
import { Home } from '../apps/home'
import { PlayGuide } from '../apps/playGuide'
import { TempScreen } from '../apps/vocabularyExplaination/temp'

import { ROUTES } from './route.constants'

// TODO: how to dynamically load the screens ??
const getRoutes = () => {
    return [
        {
            name: ROUTES.HOME,
            component: Home,
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
}

const getScreens = Stack => {
    return getRoutes().map(({ name, component }) => <Stack.Screen name={name} key={name} component={component} />)
}

export const getNavigator = () => {
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            {getScreens(Stack)}
        </Stack.Navigator>
    )
}
