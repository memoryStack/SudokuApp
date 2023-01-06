import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import { getNavigationOptions } from './navigationOptions'
import { routes } from './routes'

// TODO: how to dynamically load the screens ??

const getScreens = Stack => {
    return routes.map(({ name, component }) => (
        <Stack.Screen
            name={name}
            key={name}
            component={component}
            options={getNavigationOptions}
        />
    ))
}

export const getNavigator = () => {
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            {getScreens(Stack)}
        </Stack.Navigator>
    )
}
