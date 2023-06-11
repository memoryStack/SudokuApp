// TODO: merge renderScreen util with the testingLibrary exports
import {
    screen, fireEvent, waitFor,
} from '@utils/testing/testingLibrary'
import { getScreenName, renderScreen } from '@utils/testing/renderScreen'

import { act } from 'react-test-renderer'
import { NEXT_GAME_MENU_TEST_ID } from '../arena/nextGameMenu/nextGameMenu.constants'

import { HOME_PAGE_TEST_ID } from './home.constants'

describe('Home Page', () => {
    test('shows Next Game Menu card on Play button click', async () => {
        renderScreen({
            // TODO: it can be made better
            // we can map routeVStest_id and the screenRenderer will only return the screen root element
            // but first i need to figure out how to navigate to respective screen
            getScreenRootElement: () => screen.getByTestId(HOME_PAGE_TEST_ID),
        })

        fireEvent.press(screen.getByText('PLAY'))

        // TODO: learn async act() more deeply to understand
        //          react renders due to component internally like network call, setTimeouts etc
        //          https://callstack.github.io/react-native-testing-library/docs/understanding-act#asynchronous-act
        expect(await screen.findByTestId(NEXT_GAME_MENU_TEST_ID)).toBeOnTheScreen()
    })

    test('goes to puzzle screen upon clicking next game menu item', async () => {
        renderScreen({
            getScreenRootElement: () => screen.getByTestId(HOME_PAGE_TEST_ID),
        })

        const beforeNavigationScreenName = getScreenName()

        fireEvent.press(screen.getByText('PLAY'))

        await waitFor(() => {
            screen.getByTestId(NEXT_GAME_MENU_TEST_ID)
        })

        await act(async () => {
            fireEvent.press(screen.getByText('EASY'))
        })

        expect(getScreenName()).toBeTruthy()
        expect(beforeNavigationScreenName !== getScreenName()).toBeTruthy()
    })
})
