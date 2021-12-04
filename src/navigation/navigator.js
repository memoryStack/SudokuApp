import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Arena } from '../apps/arena'
import { Home } from '../apps/home'

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
