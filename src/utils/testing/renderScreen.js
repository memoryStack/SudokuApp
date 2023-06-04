import * as React from 'react'

import { NavigationProvider } from 'src/navigation/navigator'

import { fireLayoutEvent } from './fireEvent.utils'
import { render } from './testingLibrary'

const HOME_SCREEN_LAYOUT = {
    height: 768,
    width: 392,
    x: 0,
    y: 0,
}

export const renderScreen = ({
    getScreenRootElement,
}) => {
    const renderResult = render(<NavigationProvider />)

    fireLayoutEvent(getScreenRootElement(), HOME_SCREEN_LAYOUT)

    return {
        ...renderResult,
    }
}
