import {
    screen, fireEvent,
} from '@utils/testing/testingLibrary'
import { getScreenName, renderScreen } from '@utils/testing/renderScreen'

import { ROUTES } from 'src/navigation/route.constants'
import { HEADER_ITEMS, HEADER_ITEM_VS_TEST_ID } from 'src/navigation/headerSection/headerSection.constants'

import { ARENA_PAGE_TEST_ID } from '../constants'

describe('Arena Page', () => {
    test('should go back to home page on back button press', async () => {
        renderScreen({
            route: ROUTES.ARENA,
            getScreenRootElement: () => screen.getByTestId(ARENA_PAGE_TEST_ID),
        })

        fireEvent.press(screen.getByTestId(HEADER_ITEM_VS_TEST_ID[HEADER_ITEMS.BACK]))

        expect(getScreenName()).toBe(ROUTES.HOME)
    })
})
