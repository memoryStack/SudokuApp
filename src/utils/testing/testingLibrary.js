import React from 'react'

// TODO: fix this eslint warning
import { render } from '@testing-library/react-native'

import ThemeProvider from 'src/containers/ThemeProvider'

const AllTheProviders = ({ children }) => (
    <ThemeProvider>
        {children}
    </ThemeProvider>
)

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react-native'

export { customRender as render }
