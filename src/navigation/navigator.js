import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import { NavigationContainer } from '@react-navigation/native'

import { getNavigationOptions } from './navigationOptions'
import { routes } from './routes'
import { ROUTES } from './route.constants'

// TODO: how to dynamically load the screens ??
const getScreens = Stack => routes.map(({ name, component }) => (
    <Stack.Screen name={name} key={name} component={component} options={getNavigationOptions} />
))

const getNavigator = () => {
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator initialRouteName={ROUTES.HOME} screenOptions={{ headerShown: true }}>
            {getScreens(Stack)}
        </Stack.Navigator>
    )
}

// TODO: children prop is for testing purpose to hack navigation prop
export const NavigationProvider = ({ children }) => (
    <NavigationContainer>
        {getNavigator()}
        {children}
    </NavigationContainer>
)
