import React from 'react'

import {
    screen, fireEvent, act, renderWithEmptyNavigator,
} from '@utils/testing/testingLibrary'
import { getScreenName, renderScreen } from '@utils/testing/renderScreen'

import { MODAL_TEST_ID } from '../../../../../containers/ModalProvider/modalProvider.constants'
import { ROUTES } from '../../../../../navigation/route.constants'

import SettingsMenu from './SettingsMenu'
import { SETTINGS_MENU_TEST_ID } from './settingsMenu.constants'
import { SETTINGS_BUTTON_TEST_ID } from '../settings.constants'
import { waitFor } from '@testing-library/react-native'

describe('SettingsMenu', () => {
    test('will close the Menu if any item is clicked', async () => {
        renderWithEmptyNavigator(<SettingsMenu />)
        await waitFor(() => {
            expect(screen.queryByTestId(SETTINGS_BUTTON_TEST_ID)).toBeOnTheScreen()
        })
        act(() => {
            fireEvent.press(screen.getByTestId(SETTINGS_BUTTON_TEST_ID))
        })

        await waitFor(() => {
            screen.getByTestId(SETTINGS_MENU_TEST_ID)
        })

        fireEvent.press(screen.getByText('Language'))

        await waitFor(() => {
            expect(screen.queryByTestId(SETTINGS_MENU_TEST_ID)).not.toBeOnTheScreen()
        })
    })

    test('should open Language Selector on language menu item click', async () => {
        renderWithEmptyNavigator(<SettingsMenu />)

        await waitFor(() => {
            expect(screen.queryByTestId(SETTINGS_BUTTON_TEST_ID)).toBeOnTheScreen()
        })
        act(() => {
            fireEvent.press(screen.getByTestId(SETTINGS_BUTTON_TEST_ID))
        })

        await waitFor(() => {
            screen.getByTestId(SETTINGS_MENU_TEST_ID)
        })

        fireEvent.press(screen.getByText('Language'))

        expect(screen.getByTestId(MODAL_TEST_ID)).toBeOnTheScreen()
        screen.getByText('Select a Language')
    })

    test('should navigate to Game Rules screen on clicking on How to Play? option', async () => {
        renderScreen({})

        await waitFor(() => {
            expect(screen.queryByTestId(SETTINGS_BUTTON_TEST_ID)).toBeOnTheScreen()
        })
        act(() => {
            fireEvent.press(screen.getByTestId(SETTINGS_BUTTON_TEST_ID))
        })

        await waitFor(() => {
            screen.getByTestId(SETTINGS_MENU_TEST_ID)
        })

        await act(async () => {
            fireEvent.press(screen.getByText('How to Play?'))
        })

        expect(getScreenName()).toBe(ROUTES.PLAY_GUIDE)
    })
})
