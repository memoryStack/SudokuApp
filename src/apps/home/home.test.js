import * as React from 'react'

import {
    render, screen, fireEvent, waitFor,
} from '@utils/testing/testingLibrary'

import { NavigationProvider } from 'src/navigation/navigator'
import { fireLayoutEvent } from '@utils/testing/fireEvent.utils'

import { HOME_PAGE_TEST_ID } from './home.constants'
import { NEXT_GAME_MENU_TEST_ID } from '../arena/nextGameMenu/nextGameMenu.constants'

// TODO: how to render any screen, here navigator will render the first/home screen
// TODO: getting i18n warning errors now due to encounter with t('PLAY') function
describe('Home Page', () => {
    test('', async () => {
        // TODO: it can be made better
        // we can map routeVStest_id and the screenRenderer will only return the screen root element
        // but first i need to figure out how to navigate to respective screen
        const getScreenRootElement = () => screen.getByTestId(HOME_PAGE_TEST_ID)

        // TODO: i guess i can make a wrapper for screenRendering as well
        // that will fireLayoutEvent and will go to that particular screen and will also return that screen root element
        // while firing the event it will send the full data, not only the height
        render(<NavigationProvider />)

        // this is also a hurdle of finding the root elmeent of page and fire a layout event there
        const homePage = getScreenRootElement()

        fireLayoutEvent(homePage, { height: 800 })

        fireEvent.press(screen.getByText('PLAY'))

        // TODO: should fakeTimer be used here ?? since the component will be opened
        //          in sometime

        await waitFor(() => {
            expect(screen.getByTestId(NEXT_GAME_MENU_TEST_ID)).toBeOnTheScreen()
        })
    })
})
