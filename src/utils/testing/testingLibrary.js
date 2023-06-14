import React from 'react'
import { Provider } from 'react-redux'

// TODO: fix this eslint warning
import { render } from '@testing-library/react-native'

import ModalProvider from 'src/containers/ModalProvider'
import ThemeProvider from 'src/containers/ThemeProvider'

import 'src/i18n/i18n.config'

import store from 'src/redux/store'

const AllTheProviders = ({ children }) => (
    <Provider store={store}>
        <ThemeProvider>
            <ModalProvider>
                {children}
            </ModalProvider>
        </ThemeProvider>
    </Provider>
)

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react-native'

export { customRender as render, render as isolatedRender }
