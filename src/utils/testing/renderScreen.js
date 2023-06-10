import * as React from 'react'

import { useNavigation } from '@react-navigation/native'

import { NavigationProvider } from 'src/navigation/navigator'

import { fireLayoutEvent } from './fireEvent.utils'
import { render } from './testingLibrary'

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

    React.useEffect(() => {
        onNavigationReceived(navigation)
    }, [navigation])

    React.useEffect(() => {
        if (!route) return

        navigation.navigate(route, routeOptions)
    }, [navigation, route, routeOptions])

    return (
        null
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
