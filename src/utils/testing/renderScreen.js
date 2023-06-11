import * as React from 'react'
import { Text } from 'react-native'

import { useNavigation, useNavigationState } from '@react-navigation/native'

import _get from '@lodash/get'

import { NavigationProvider } from 'src/navigation/navigator'

import { fireLayoutEvent } from './fireEvent.utils'
import { render, screen } from './testingLibrary'

const HOME_SCREEN_LAYOUT = {
    height: 768,
    width: 392,
    x: 0,
    y: 0,
}

const NavigateToRoute = ({
    route = '',
    routeOptions = {},
    onNavigationReceived,
}) => {
    const navigation = useNavigation()

    const routeName = useNavigationState(state => _get(state, ['routeNames', _get(state, 'index')], 'NO SCREEN'))

    React.useEffect(() => {
        onNavigationReceived(navigation)
    }, [navigation])

    React.useEffect(() => {
        if (!route) return

        navigation.navigate(route, routeOptions)
    }, [navigation, route, routeOptions])

    return (
        <Text testID="current_screen_name">{routeName}</Text>
    )
}

export const renderScreen = ({
    getScreenRootElement,
    route,
    routeOptions,
}) => {
    let navigation = null

    const renderResult = render(
        <NavigationProvider>
            <NavigateToRoute
                route={route}
                routeOptions={routeOptions}
                onNavigationReceived={_navigation => {
                    navigation = _navigation
                }}
            />
        </NavigationProvider>,
    )

    fireLayoutEvent(getScreenRootElement(), HOME_SCREEN_LAYOUT)

    return {
        ...renderResult,
        navigation,
    }
}

export const getScreenName = () => screen.getByTestId('current_screen_name').children[0]
