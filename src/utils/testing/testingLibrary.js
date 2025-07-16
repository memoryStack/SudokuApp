/* eslint-disable import/no-extraneous-dependencies */
import React, { useContext, useEffect } from 'react'

import { Provider } from 'react-redux'

import PropTypes from 'prop-types'

import { NavigationContainer } from '@react-navigation/native'

import { render } from '@testing-library/react-native'

import { configureStore } from '@reduxjs/toolkit'

import DependencyProvider from '../../containers/DependencyProvider'
import ModalProvider from '../../containers/ModalProvider'
import ThemeProvider from '../../containers/ThemeProvider'

import { SnackBar } from '../../apps/components/SnackBar/SnackBar'

import '../../i18n/i18n.config'

import smartHintHCReducers from '../../apps/arena/store/reducers/smartHintHC.reducers'
import refreeReducers from '../../apps/arena/store/reducers/refree.reducers'
import gameStateReducers from '../../apps/arena/store/reducers/gameState.reducers'
import boardControllerReducers from '../../apps/arena/store/reducers/boardController.reducers'
import boardReducers from '../../apps/arena/store/reducers/board.reducers'

import { initDispatch, initGetState } from '../../redux/dispatch.helpers'
import { NavigationProvider } from 'src/navigation/navigator'
import SpotlightTourProvider from 'src/containers/SpotlightTourProvider'
import AsyncStoreStateInitializationProvider from 'src/containers/AsyncStoreStateInitializationProvider'
import UIComponentsProvider from 'src/containers/UIComponentsProvider'
import { useDependency } from 'src/hooks/useDependency'
import { emit } from '@utils/GlobalEventBus'
import DependencyContext from '@contexts/DependencyContext'

const getNewStore = () => {
    const store = configureStore({
        reducer: {
            smartHintHC: smartHintHCReducers,
            refree: refreeReducers,
            gameState: gameStateReducers,
            boardController: boardControllerReducers,
            board: boardReducers,
        },
    })

    initDispatch(store.dispatch)
    initGetState(store.getState)

    return store
}

const AllTheProviders = ({ children }) => (
    <Provider store={getNewStore()}>
        <DependencyProvider>
            <AsyncStoreStateInitializationProvider>
                <ThemeProvider>
                    <UIComponentsProvider>
                        <ModalProvider>
                            <SpotlightTourProvider>
                                <>
                                    {children}
                                    <SnackBar />
                                </>
                            </SpotlightTourProvider>
                        </ModalProvider>
                    </UIComponentsProvider>
                </ThemeProvider>
            </AsyncStoreStateInitializationProvider>
        </DependencyProvider>
    </Provider>
)

AllTheProviders.propTypes = {
    children: PropTypes.node,
}

AllTheProviders.defaultProps = {
    children: null,
}

const FireEventForPageMount = () => {
    const { state: { gameSettingsInitialized = false } = {} } = useContext(DependencyContext) || {}

    useEffect(() => {
        if (gameSettingsInitialized) {
            setTimeout(() => {
                emit('RENDER_CALLED_EVENT')
            }, 100)
        }
    }, [gameSettingsInitialized])
    return null
}

const customRender = (ui, options) => render(ui, {
    wrapper: ({ children }) => (
        <AllTheProviders>
            <>
                {children}
                <FireEventForPageMount />
            </>
        </AllTheProviders>
    ),
    ...options,
})

// to be used for components which use navigation related hooks or utilities
// but don't actually exercise like navigation.navigate(to some screen)
// it's done so that the test completes faster.
// if any test-case exercise navigation.navigate() then it's better to use "renderScreen"
// as the component renderer
const renderWithEmptyNavigator = (ui, options) => render(ui, {
    wrapper: ({ children }) => (
        <Provider store={getNewStore()}>
            <DependencyProvider>
                <AsyncStoreStateInitializationProvider>
                    <ThemeProvider>
                        <UIComponentsProvider>
                            <ModalProvider>
                                <SpotlightTourProvider>
                                    <NavigationContainer>
                                        <>
                                            {children}
                                            <FireEventForPageMount />
                                        </>
                                    </NavigationContainer>
                                </SpotlightTourProvider>
                            </ModalProvider>
                        </UIComponentsProvider>
                    </ThemeProvider>
                </AsyncStoreStateInitializationProvider>
            </DependencyProvider>
        </Provider>
    ),
    ...options,
})

export * from '@testing-library/react-native'

export {
    customRender as render,
    render as isolatedRender,
    renderWithEmptyNavigator,
}

// export { waitFor } from '@testing-library/dom'
