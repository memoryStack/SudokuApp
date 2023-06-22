import * as React from 'react'
import { Text } from 'react-native'

import PropTypes from 'prop-types'

import { useNavigation, useNavigationState } from '@react-navigation/native'

import _get from '@lodash/get'
import _noop from '@lodash/noop'

import { NavigationProvider, navigationRef } from 'src/navigation/navigator'

import { consoleLog } from '@utils/util'
import { addListener, emit, removeListener } from '@utils/GlobalEventBus'

import { ROUTES } from 'src/navigation/route.constants'

import { fireLayoutEvent } from './fireEvent.utils'
import { render, screen, act } from './testingLibrary'

const HOME_SCREEN_LAYOUT = {
    height: 768,
    width: 392,
    x: 0,
    y: 0,
}

const SCREEN_NAME_TEXT_TEST_ID = 'current_screen_name'
const RENDER_CALLED_EVENT = 'RENDER_CALLED_EVENT'

const NavigateToRoute_ = ({
    route,
    routeOptions,
    onNavigationReceived,
    children,
    getScreenRootElement,
}) => {
    const navigation = useNavigation()

    const [renderCalled, setRenderCalled] = React.useState(false)

    const routeName = useNavigationState(state => _get(state, ['routes', _get(state, 'index'), 'name'], 'NO SCREEN'))

    React.useEffect(() => {
        if (navigation) onNavigationReceived(navigation)
    }, [navigation])

    React.useEffect(() => {
        if (!route || !navigationRef.isReady()) return

        navigation.navigate(route, routeOptions)
    }, [navigation, route, routeOptions])

    const isScreenRendered = routeName === route

    React.useEffect(() => {
        if (!isScreenRendered || !renderCalled) return

        fireLayoutEvent(getScreenRootElement(), HOME_SCREEN_LAYOUT)
    }, [isScreenRendered, renderCalled, getScreenRootElement])

    React.useEffect(() => {
        const handler = () => setRenderCalled(true)

        addListener(RENDER_CALLED_EVENT, handler)

        return () => {
            removeListener(RENDER_CALLED_EVENT, handler)
        }
    }, [])

    return (
        <>
            {children}
            <Text testID={SCREEN_NAME_TEXT_TEST_ID}>{routeName}</Text>
        </>
    )
}
NavigateToRoute_.propTypes = {
    route: PropTypes.string,
    routeOptions: PropTypes.object,
    onNavigationReceived: PropTypes.func,
    children: PropTypes.element,
    getScreenRootElement: PropTypes.func,
}
NavigateToRoute_.defaultProps = {
    route: '',
    routeOptions: {},
    onNavigationReceived: _noop,
    children: null,
    getScreenRootElement: _noop,
}
const NavigateToRoute = React.memo(NavigateToRoute_)

export const getScreenName = () => {
    let result
    try {
        result = screen.getByTestId(SCREEN_NAME_TEXT_TEST_ID).children[0]
    } catch (error) {
        consoleLog(error)
    }
    return result
}

export const renderScreen = ({
    getScreenRootElement = _noop,
    route = ROUTES.HOME,
    routeOptions,
    children,
} = {}) => {
    let navigation = null

    // TODO: how to render only relevant screens for a
    //     specific test-case, i hope it will improve the test completion time.
    const renderResult = render(
        <NavigationProvider>
            <NavigateToRoute
                route={route}
                routeOptions={routeOptions}
                onNavigationReceived={_navigation => {
                    navigation = _navigation
                }}
                getScreenRootElement={getScreenRootElement}
            >
                {children}
            </NavigateToRoute>
        </NavigationProvider>,
    )

    act(() => {
        emit(RENDER_CALLED_EVENT)
    })

    return {
        ...renderResult,
        navigation,
    }
}
