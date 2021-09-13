import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Arena } from '../src/apps/arena'
import { Home } from '../src/apps/home'
import { OnlineRoom } from '../src/apps/onlineRoom'
import { HostGame } from '../src/apps/onlineRoom/hostGame'

const getRoutes = () => {
    return [
        {
            name: 'Home',
            component: Home,
        },
        {
            name: 'Arena',
            component: Arena,
        },
        {
            name: 'OnlineRoom',
            component: OnlineRoom,
        },
        {
            name: 'HostGame',
            component: HostGame,
        }
    ]
}

const getScreens = (Stack) => {
    return getRoutes().map(({name, component}) => (
        <Stack.Screen
            name={name}
            key={name}
            component={component}
        />
    ))
}

export const getNavigator = () => {
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ headerShown: false }}
        >
            {getScreens(Stack)}
        </Stack.Navigator>
    )
}
