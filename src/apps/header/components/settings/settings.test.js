import React from 'react'

import {
    screen, fireEvent, renderWithEmptyNavigator,
} from '@utils/testing/testingLibrary'

import { SETTINGS_MENU_TEST_ID } from './settingsMenu/settingsMenu.constants'
import { Settings } from './settings'
import { SETTINGS_BUTTON_TEST_ID } from './settings.constants'

describe('Settings Header Icon', () => {
    test('should toggle settings menu visibility on click', () => {
        renderWithEmptyNavigator(<Settings />)

        fireEvent.press(screen.getByTestId(SETTINGS_BUTTON_TEST_ID))
        screen.getByTestId(SETTINGS_MENU_TEST_ID)
        fireEvent.press(screen.getByTestId(SETTINGS_BUTTON_TEST_ID))
        expect(screen.queryByTestId(SETTINGS_MENU_TEST_ID)).not.toBeOnTheScreen()
    })
})
