// TODO: merge renderScreen util with the testingLibrary exports
import {
    screen, fireEvent, within,
} from '@utils/testing/testingLibrary'
import { renderScreen } from '@utils/testing/renderScreen'

import { MODAL_TEST_ID } from 'src/containers/ModalProvider/modalProvider.constants'
import { SETTINGS_BUTTON_TEST_ID, SETTINGS_MENU_TEST_ID } from '../../header/components/settings/settings.constants'

import { HOME_PAGE_TEST_ID } from '../home.constants'

// had to create a new file for this test-case to umock the below dependency
jest.unmock('react-i18next')

describe('Settings Menu Language Item Functionality', () => {
    const renderMenu = async () => {
        renderScreen({
            getScreenRootElement: () => screen.getByTestId(HOME_PAGE_TEST_ID),
        })

        fireEvent.press(screen.getByTestId(SETTINGS_BUTTON_TEST_ID))

        expect(await screen.findByTestId(SETTINGS_MENU_TEST_ID)).toBeOnTheScreen()
    }

    test('should open language selector modal on click', async () => {
        await renderMenu()

        fireEvent.press(screen.getByText('Language'))

        expect(screen.getByTestId(MODAL_TEST_ID)).toBeOnTheScreen()
    })

    test('should change language on saving a different language', async () => {
        await renderMenu()

        fireEvent.press(screen.getByText('Language'))

        const languageSelectorModal = within(screen.getByTestId(MODAL_TEST_ID))

        fireEvent.press(languageSelectorModal.getByText('हिंदी'))

        fireEvent.press(languageSelectorModal.getByText('Save'))

        const homePage = within(screen.getByTestId(HOME_PAGE_TEST_ID))
        homePage.getByText('खेले')
    })
})
