import React from 'react'

// TODO: fix this eslint warning
import { render } from '@testing-library/react-native'

import ThemeProvider from 'src/containers/ThemeProvider'
import { Provider } from 'react-redux'
import store from 'src/redux/store'

const AllTheProviders = ({ children }) => (
    <Provider store={store}>
        <ThemeProvider>
            {children}
        </ThemeProvider>
    </Provider>
)

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react-native'

export { customRender as render }
