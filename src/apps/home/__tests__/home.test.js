// TODO: merge renderScreen util with the testingLibrary exports
import {
    screen, fireEvent, waitFor, act,
} from '@utils/testing/testingLibrary'
import { getScreenName, renderScreen } from '@utils/testing/renderScreen'

import { TIMER_TEST_ID } from '../../arena/timer/timer.constants'
import { ROUTES } from '../../../navigation/route.constants'

import { MISTAKES_TEXT_TEST_ID, PUZZLE_LEVEL_TEXT_TEST_ID } from '../../arena/refree/refree.constants'
import { NEXT_GAME_MENU_TEST_ID } from '../../arena/nextGameMenu/nextGameMenu.constants'
import { SETTINGS_BUTTON_TEST_ID } from '../../header/components/settings/settings.constants'
import { SETTINGS_MENU_TEST_ID } from '../../header/components/settings/settingsMenu/settingsMenu.constants'

import { HOME_PAGE_TEST_ID } from '../home.constants'

jest.mock('../../../adapters/puzzle/puzzle')

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

        fireEvent.press(screen.getByText('PLAY'))

        await waitFor(() => {
            screen.getByTestId(NEXT_GAME_MENU_TEST_ID)
        })

        await act(async () => {
            fireEvent.press(screen.getByText('EASY'))
        })

        expect(getScreenName()).toBeTruthy()
        expect(getScreenName()).toBe(ROUTES.ARENA)
    })

    test('refree default state on game start', async () => {
        renderScreen({
            getScreenRootElement: () => screen.getByTestId(HOME_PAGE_TEST_ID),
        })

        fireEvent.press(screen.getByText('PLAY'))

        await waitFor(() => {
            screen.getByTestId(NEXT_GAME_MENU_TEST_ID)
        })

        await act(async () => {
            fireEvent.press(screen.getByText('MEDIUM'))
        })

        expect(screen.getByTestId(PUZZLE_LEVEL_TEXT_TEST_ID)).toHaveTextContent('MEDIUM')
        expect(screen.getByTestId(MISTAKES_TEXT_TEST_ID)).toHaveTextContent(/Mistakes: 0/)
        expect(screen.getByTestId(TIMER_TEST_ID)).toHaveTextContent(/00:00:00/)
    })
})

describe('Home Page Header Settings Button', () => {
    test('opens and closes the settings menu click', async () => {
        renderScreen({
            getScreenRootElement: () => screen.getByTestId(HOME_PAGE_TEST_ID),
        })

        fireEvent.press(screen.getByTestId(SETTINGS_BUTTON_TEST_ID))

        expect(await screen.findByTestId(SETTINGS_MENU_TEST_ID)).toBeOnTheScreen()

        fireEvent.press(screen.getByTestId(SETTINGS_BUTTON_TEST_ID))

        expect(screen.queryByTestId(SETTINGS_MENU_TEST_ID)).not.toBeOnTheScreen()
    })
})
