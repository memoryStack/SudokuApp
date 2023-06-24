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

const renderScreenAndWaitForPuzzleStart = async () => {
    renderScreen({
        route: ROUTES.ARENA,
        getScreenRootElement: () => screen.getByTestId(ARENA_PAGE_TEST_ID),
    })

    await hasPuzzleStarted()
}

describe('Arena Screen', () => {
    // added this to avoid "ReferenceError: You are trying to `import` a file after the Jest environment has been torn down."
    // error due to timer setTimeout
    // TODO: read more about the jest.useFakeTimers() and this cleanup func
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(cleanup)

    test('should go back to home page on back button press', async () => {
        await renderScreenAndWaitForPuzzleStart()

        fireEvent.press(screen.getByTestId(HEADER_ITEM_VS_TEST_ID[HEADER_ITEMS.BACK]))

        expect(getScreenName()).toBe(ROUTES.HOME)
    })
})

describe('Game Pause', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(cleanup)

    test('all board numbers will be disappeared', async () => {
        await renderScreenAndWaitForPuzzleStart()

        fireEvent.press(screen.getByTestId(TIMER_TEST_ID))

        checkAllCellsEmpty()
    })

    test('all board controllers will be disabled', async () => {
        await renderScreenAndWaitForPuzzleStart()

        fireEvent.press(screen.getByTestId(TIMER_TEST_ID))

        allBoardControllersDisabled()
    })

    test('all input panel items will be disabled', async () => {
        await renderScreenAndWaitForPuzzleStart()

        fireEvent.press(screen.getByTestId(TIMER_TEST_ID))

        allInputPanelItemsAreDisabled()
    })

    test('start the timer icon will be visible', async () => {
        await renderScreenAndWaitForPuzzleStart()

        fireEvent.press(screen.getByTestId(TIMER_TEST_ID))

        expect(screen.getByTestId(TIMER_START_ICON_TEST_ID)).toBeVisible()
    })

    test('timer will be cleared', async () => {
        jest.spyOn(global, 'clearInterval')

        await renderScreenAndWaitForPuzzleStart()

        fireEvent.press(screen.getByTestId(TIMER_TEST_ID))

        expect(clearInterval).toHaveBeenCalledTimes(1)
    })
})
