import React from 'react'

import {
    render, fireEvent, screen, within, waitFor,
} from '@utils/testing/testingLibrary'

import { isRadioSelected as isSelectedLanguageOptionHighlighted } from '@ui/atoms/RadioButton/radioButton.testUtils'
import { LANGUAGE_KEYS } from '../../../i18n/languages'

import LanguageSelector from './LanguageSelector'
import { LANGUAGE_OPTION_TEST_ID, SELECTED_OPTION_HIGHLIGHTER_TEST_ID } from './languageSelector.constants'

describe('Language Selector Dialog', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('clicking on each language option will select that option', async () => {
        const hideModal = jest.fn()
        render(<LanguageSelector hideModal={hideModal} dependencies={{ commonAnalytics: { sendLanguageSavedEvent: jest.fn() } }} />)

        await waitFor(() => {
            screen.getByTestId(LANGUAGE_OPTION_TEST_ID[LANGUAGE_KEYS.HINDI])
        })

        const touchableparent = screen.getByTestId(LANGUAGE_OPTION_TEST_ID[LANGUAGE_KEYS.HINDI])
        const highlighterView = within(touchableparent).getByTestId(SELECTED_OPTION_HIGHLIGHTER_TEST_ID)

        expect(isSelectedLanguageOptionHighlighted(highlighterView)).toBe(false)

        fireEvent.press(touchableparent)

        expect(isSelectedLanguageOptionHighlighted(highlighterView)).toBe(true)
    })

    test('Cancel button will request to close the modal', async () => {
        const hideModal = jest.fn()
        render(<LanguageSelector hideModal={hideModal} dependencies={{ commonAnalytics: { sendLanguageSavedEvent: jest.fn() } }} />)
        await waitFor(() => {
            screen.getByText('Cancel')
        })
        fireEvent.press(screen.getByText('Cancel'))
        expect(hideModal).toHaveBeenCalledTimes(1)
    })

    test('Save button will request to change the language and close the modal', async () => {
        const hideModal = jest.fn()
        render(<LanguageSelector hideModal={hideModal} dependencies={{ commonAnalytics: { sendLanguageSavedEvent: jest.fn() } }} />)
        await waitFor(() => {
            screen.getByText('Save')
        })
        fireEvent.press(screen.getByText('Save'))

        // expect(mockChangeLanguage).toHaveBeenCalledTimes(1) // is there any way to test this ?
        expect(hideModal).toHaveBeenCalledTimes(1)
    })

    test('Save button will request to change the language with newly selected language', async () => {
        const hideModal = jest.fn()
        render(<LanguageSelector hideModal={hideModal} dependencies={{ commonAnalytics: { sendLanguageSavedEvent: jest.fn() } }} />)
        await waitFor(() => {
            screen.getByText('हिंदी')
        })
        fireEvent.press(screen.getByText('हिंदी'))
        fireEvent.press(screen.getByText('Save'))
        // TODO: research if using 'हिंदी' and 'HINDI' label and key here
        //      is tapping into implementatin details or not
        // expect(mockChangeLanguage).toHaveBeenCalledWith('HINDI') // is there any way to test this ?
    })
})
