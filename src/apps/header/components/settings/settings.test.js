import React from 'react'

import {
    screen, fireEvent, renderWithEmptyNavigator,
} from '@utils/testing/testingLibrary'

import { SETTINGS_MENU_TEST_ID } from './settingsMenu/settingsMenu.constants'
import { Settings } from './settings'
import { SETTINGS_BUTTON_TEST_ID } from './settings.constants'
import { waitFor } from '@testing-library/react-native'

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useRoute: jest.fn(),
    };
});

describe('Settings Header Icon', () => {
    test('should toggle settings menu visibility on click', async () => {
        renderWithEmptyNavigator(<Settings />)
        await waitFor(() => {
            expect(screen.queryByTestId(SETTINGS_BUTTON_TEST_ID)).toBeOnTheScreen()
        })
        fireEvent.press(screen.getByTestId(SETTINGS_BUTTON_TEST_ID))
        screen.getByTestId(SETTINGS_MENU_TEST_ID)
        fireEvent.press(screen.getByTestId(SETTINGS_BUTTON_TEST_ID))
        expect(screen.queryByTestId(SETTINGS_MENU_TEST_ID)).not.toBeOnTheScreen()
    })
})
