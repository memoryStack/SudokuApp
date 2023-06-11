// TODO: merge renderScreen util with the testingLibrary exports
import {
    screen, fireEvent, waitFor,
} from '@utils/testing/testingLibrary'
import { getScreenName, renderScreen } from '@utils/testing/renderScreen'

import { act } from 'react-test-renderer'
import { NEXT_GAME_MENU_TEST_ID } from '../arena/nextGameMenu/nextGameMenu.constants'

import { HOME_PAGE_TEST_ID } from './home.constants'

jest.mock('fast-sudoku-puzzles', () => ({
    RNSudokuPuzzle: {
        getSudokuPuzzle: clues => Promise.resolve(
            {
                clues: [
                    9, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0,
                    0, 0, 4, 0, 2, 7, 0, 6, 1, 0, 2, 7,
                    0, 0, 0, 0, 9, 5, 0, 0, 0, 0, 0, 4,
                    0, 8, 0, 0, 1, 0, 0, 9, 0, 6, 0, 0,
                    0, 0, 0, 7, 8, 0, 0, 0, 0, 8, 5, 0,
                    1, 4, 0, 8, 5, 0, 6, 0, 0, 0, 0, 0,
                    0, 0, 0, 3, 0, 0, 0, 0, 2,
                ],
                solution: [
                    9, 2, 7, 5, 3, 8, 4, 6, 1, 5, 3, 8,
                    1, 6, 4, 9, 2, 7, 4, 6, 1, 9, 2, 7,
                    5, 3, 8, 2, 9, 5, 7, 8, 3, 6, 1, 4,
                    7, 8, 3, 4, 1, 6, 2, 9, 5, 6, 1, 4,
                    2, 9, 5, 7, 8, 3, 3, 7, 9, 8, 5, 2,
                    1, 4, 6, 8, 5, 2, 6, 4, 1, 3, 7, 9,
                    1, 4, 6, 3, 7, 9, 8, 5, 2,
                ],
            },
        ),
    },
}))

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

    test('goes to puzzle screen upon clicking', async () => {
        renderScreen({
            // TODO: it can be made better
            // we can map routeVStest_id and the screenRenderer will only return the screen root element
            // but first i need to figure out how to navigate to respective screen
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
