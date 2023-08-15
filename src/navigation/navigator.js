import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'

import { getNavigationOptions } from './navigationOptions'
import { routes } from './routes'
import { ROUTES } from './route.constants'

export const navigationRef = createNavigationContainerRef()

// TODO: how to dynamically load the screens ??
const getScreens = Stack => routes.map(({ name, component }) => (
    <Stack.Screen name={name} key={name} component={component} options={getNavigationOptions} />
))

const getNavigator = () => {
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator
            initialRouteName={ROUTES.HOME}
            screenOptions={{
                headerShown: true,
                headerTransparent: true,
            }}
        >
            {getScreens(Stack)}
        </Stack.Navigator>
    )
}

// children prop is for testing purpose to hack navigation prop
// eslint-disable-next-line react/prop-types
export const NavigationProvider = ({ children }) => (
    <NavigationContainer ref={navigationRef}>
        {getNavigator()}
        {children}
    </NavigationContainer>
)
