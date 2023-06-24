import {
    screen, fireEvent, cleanup,
} from '@utils/testing/testingLibrary'
import { getScreenName, renderScreen } from '@utils/testing/renderScreen'

import { ROUTES } from 'src/navigation/route.constants'
import { HEADER_ITEMS, HEADER_ITEM_VS_TEST_ID } from 'src/navigation/headerSection/headerSection.constants'

import { checkAllCellsEmpty, hasPuzzleStarted } from '@utils/testing/arena'
import { ARENA_PAGE_TEST_ID } from '../constants'
import { TIMER_TEST_ID } from '../timer/timer.constants'

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

    test('on clicking on Timer all board numbers will be disappeared', async () => {
        renderScreen({
            route: ROUTES.ARENA,
            getScreenRootElement: () => screen.getByTestId(ARENA_PAGE_TEST_ID),
        })

        await hasPuzzleStarted()

        fireEvent.press(screen.getByTestId(TIMER_TEST_ID))

        checkAllCellsEmpty()
    })
})
