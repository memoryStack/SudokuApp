import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { useTheme } from 'src/apps/arena/hooks/useTheme'
import { Theme } from 'src/containers/ThemeProvider'
import { getNavigationOptions } from './navigationOptions'
import { routes } from './routes'
import { ROUTES } from './route.constants'

// TODO: how to dynamically load the screens ??

const getScreens = Stack => routes.map(({ name, component }) => (
    <Stack.Screen name={name} key={name} component={component} options={getNavigationOptions} />
))

export const getNavigator = () => {
    const Stack = createStackNavigator()
    return (
        <Stack.Navigator initialRouteName={ROUTES.HOME} screenOptions={{ headerShown: true }}>
            {getScreens(Stack)}
        </Stack.Navigator>
    )
}

export const NavigationProvider = () => {
    const { colorScheme } = useTheme()

    return (
        <NavigationContainer theme={Theme.isDarkTheme(colorScheme) ? DarkTheme : DefaultTheme}>
            {getNavigator()}
        </NavigationContainer>
    )
}
