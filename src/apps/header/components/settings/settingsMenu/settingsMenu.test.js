import React from 'react'

import {
    screen, fireEvent, act, renderWithEmptyNavigator,
} from '@utils/testing/testingLibrary'
import { getScreenName, renderScreen } from '@utils/testing/renderScreen'

import { MODAL_TEST_ID } from 'src/containers/ModalProvider/modalProvider.constants'
import { ROUTES } from 'src/navigation/route.constants'

import SettingsMenu from './SettingsMenu'
import { SETTINGS_MENU_TEST_ID } from './settingsMenu.constants'

describe('SettingsMenu', () => {
    test('will close the Menu if any item is clicked', () => {
        const onClose = jest.fn()
        renderWithEmptyNavigator(<SettingsMenu open onClose={onClose} />)

        screen.getByTestId(SETTINGS_MENU_TEST_ID)

        fireEvent.press(screen.getByText('Language'))

        expect(onClose).toHaveBeenCalledTimes(1)
    })

    test('should open Language Selector on language menu item click', () => {
        const onClose = jest.fn()
        renderWithEmptyNavigator(<SettingsMenu open onClose={onClose} />)

        fireEvent.press(screen.getByText('Language'))

        expect(screen.getByTestId(MODAL_TEST_ID)).toBeOnTheScreen()
        screen.getByText('Select a Language')
    })

    test('should navigate to Game Rules screen on clicking on How to Play? option', async () => {
        const onClose = jest.fn()
        renderScreen({
            children: <SettingsMenu open onClose={onClose} />,
        })

        await act(async () => {
            fireEvent.press(screen.getByText('How to Play?'))
        })

        expect(getScreenName()).toBe(ROUTES.PLAY_GUIDE)
    })
})
