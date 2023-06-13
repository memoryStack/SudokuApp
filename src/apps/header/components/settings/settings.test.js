import React from 'react'

import {
    screen, fireEvent, render,
} from '@utils/testing/testingLibrary'

import { Settings } from './settings'
import { SETTINGS_BUTTON_TEST_ID, SETTINGS_MENU_TEST_ID } from './settings.constants'

describe('Settings Header Icon', () => {
    test('should toggle settings menu visibility on click', () => {
        render(<Settings />)

        fireEvent.press(screen.getByTestId(SETTINGS_BUTTON_TEST_ID))
        screen.getByTestId(SETTINGS_MENU_TEST_ID)
        fireEvent.press(screen.getByTestId(SETTINGS_BUTTON_TEST_ID))
        expect(screen.queryByTestId(SETTINGS_MENU_TEST_ID)).not.toBeOnTheScreen()
    })

    test('should call onAction for each Menu Item click and close the menu as well', async () => {
        const onAction = jest.fn()
        render(<Settings onAction={onAction} />)

        fireEvent.press(screen.getByTestId(SETTINGS_BUTTON_TEST_ID))
        fireEvent.press(screen.getByText('Language'))

        expect(onAction).toHaveBeenCalledTimes(1)
        expect(screen.queryByTestId(SETTINGS_MENU_TEST_ID)).not.toBeOnTheScreen()
    })
})
