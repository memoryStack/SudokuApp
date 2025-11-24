import React from 'react'
import PropTypes from 'prop-types'

import { createStackNavigator } from '@react-navigation/stack'

import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'

import { getNavigationOptions } from './navigationOptions'
import { routes } from './routes'
import { ROUTES } from './route.constants'
import { useTheme } from 'src/apps/arena/hooks/useTheme'
import _get from '@lodash/get'

export const navigationRef = createNavigationContainerRef()

// TODO: how to dynamically load the screens ??
const getScreens = Stack => routes.map(({ name, component }) => (
    <Stack.Screen name={name} key={name} component={component} options={getNavigationOptions} />
))

// children prop is for testing purpose to hack navigation prop
export const NavigationProvider = ({ children }) => {
    const Stack = createStackNavigator()
    const { theme } = useTheme()
    return (
        <NavigationContainer ref={navigationRef} theme={theme}>
            <Stack.Navigator
                initialRouteName={ROUTES.HOME}
                screenOptions={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitleStyle: {
                        color: _get(theme, ['colors', 'on-surface'])
                    },
                }}
            >
                {getScreens(Stack)}
            </Stack.Navigator>
            {children}
        </NavigationContainer>
    )
}

NavigationProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
}

NavigationProvider.defaultProps = {
    children: null,
}
