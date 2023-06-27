import React from 'react'
import { Provider } from 'react-redux'

import { NavigationContainer } from '@react-navigation/native'

// TODO: fix this eslint warning
import { render } from '@testing-library/react-native'

import ModalProvider from 'src/containers/ModalProvider'
import ThemeProvider from 'src/containers/ThemeProvider'

import { SnackBar } from 'src/apps/components/SnackBar'

import 'src/i18n/i18n.config'

import store from 'src/redux/store'

const AllTheProviders = ({ children }) => (
    <Provider store={store}>
        <ThemeProvider>
            <ModalProvider>
                <>
                    {children}
                    <SnackBar />
                </>
            </ModalProvider>
        </ThemeProvider>
    </Provider>
)

const customRender = (ui, options) => render(ui, {
    wrapper: ({ children }) => (
        <AllTheProviders>{children}</AllTheProviders>
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
        <Provider store={store}>
            <ThemeProvider>
                <ModalProvider>
                    <NavigationContainer>
                        {children}
                    </NavigationContainer>
                </ModalProvider>
            </ThemeProvider>
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
