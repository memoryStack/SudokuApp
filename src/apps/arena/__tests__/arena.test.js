import {
    screen, fireEvent, cleanup,
} from '@utils/testing/testingLibrary'
import { getScreenName, renderScreen } from '@utils/testing/renderScreen'

import { ROUTES } from 'src/navigation/route.constants'
import { HEADER_ITEMS, HEADER_ITEM_VS_TEST_ID } from 'src/navigation/headerSection/headerSection.constants'

import {
    allBoardControllersDisabled,
    checkAllCellsEmpty,
    hasPuzzleStarted,
    allInputPanelItemsAreDisabled,
} from '@utils/testing/arena'
import { ARENA_PAGE_TEST_ID } from '../constants'
import { TIMER_START_ICON_TEST_ID, TIMER_TEST_ID } from '../timer/timer.constants'

describe('Arena Screen', () => {
    // added this to avoid "ReferenceError: You are trying to `import` a file after the Jest environment has been torn down."
    // error due to timer setTimeout
    // TODO: read more about the jest.useFakeTimers() and this cleanup func
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(cleanup)

    test('should go back to home page on back button press', async () => {
        renderScreen({
            route: ROUTES.ARENA,
            getScreenRootElement: () => screen.getByTestId(ARENA_PAGE_TEST_ID),
        })

        await hasPuzzleStarted()

        fireEvent.press(screen.getByTestId(HEADER_ITEM_VS_TEST_ID[HEADER_ITEMS.BACK]))

        expect(getScreenName()).toBe(ROUTES.HOME)
    })

    // game pause attribute 1
    test('on clicking on Timer all board numbers will be disappeared', async () => {
        renderScreen({
            route: ROUTES.ARENA,
            getScreenRootElement: () => screen.getByTestId(ARENA_PAGE_TEST_ID),
        })

        await hasPuzzleStarted()

        fireEvent.press(screen.getByTestId(TIMER_TEST_ID))

        checkAllCellsEmpty()
    })

    // game pause attribute 2
    test('all board controllers will be disabled on timer click', async () => {
        renderScreen({
            route: ROUTES.ARENA,
            getScreenRootElement: () => screen.getByTestId(ARENA_PAGE_TEST_ID),
        })

        await hasPuzzleStarted()

        fireEvent.press(screen.getByTestId(TIMER_TEST_ID))

        allBoardControllersDisabled()
    })

    // game pause attribute 3
    test('all input panel items will be disabled on timer click', async () => {
        renderScreen({
            route: ROUTES.ARENA,
            getScreenRootElement: () => screen.getByTestId(ARENA_PAGE_TEST_ID),
        })

        await hasPuzzleStarted()

        fireEvent.press(screen.getByTestId(TIMER_TEST_ID))

        allInputPanelItemsAreDisabled()
    })

    // game pause attribute 4
    test('start the timer icon will be visible on timer click', async () => {
        renderScreen({
            route: ROUTES.ARENA,
            getScreenRootElement: () => screen.getByTestId(ARENA_PAGE_TEST_ID),
        })

        await hasPuzzleStarted()

        fireEvent.press(screen.getByTestId(TIMER_TEST_ID))

        expect(screen.getByTestId(TIMER_START_ICON_TEST_ID)).toBeVisible()
    })

    // game pause attribute 5
    test('timer will be cleared on timer click', async () => {
        jest.spyOn(global, 'clearInterval')

        renderScreen({
            route: ROUTES.ARENA,
            getScreenRootElement: () => screen.getByTestId(ARENA_PAGE_TEST_ID),
        })

        await hasPuzzleStarted()

        fireEvent.press(screen.getByTestId(TIMER_TEST_ID))

        expect(clearInterval).toHaveBeenCalledTimes(1)
    })
})
