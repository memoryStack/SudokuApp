import * as React from 'react'

import {
    screen, fireEvent, waitFor,
} from '@utils/testing/testingLibrary'
import { renderScreen } from '@utils/testing/renderScreen'

import { NEXT_GAME_MENU_TEST_ID } from '../arena/nextGameMenu/nextGameMenu.constants'

import { HOME_PAGE_TEST_ID } from './home.constants'

// TODO: how to render any screen, here navigator will render the first/home screen
// TODO: getting i18n warning errors now due to encounter with t('PLAY') function
describe('Home Page', () => {
    test('shows Next Game Menu card on Play button click', async () => {
        renderScreen({
            // TODO: it can be made better
            // we can map routeVStest_id and the screenRenderer will only return the screen root element
            // but first i need to figure out how to navigate to respective screen
            getScreenRootElement: () => screen.getByTestId(HOME_PAGE_TEST_ID),
        })

        fireEvent.press(screen.getByText('PLAY'))

        // TODO: should fakeTimer be used here ?? since the component will be opened
        //          in sometime

        await waitFor(() => {
            expect(screen.getByTestId(NEXT_GAME_MENU_TEST_ID)).toBeOnTheScreen()
        })
    })
})
