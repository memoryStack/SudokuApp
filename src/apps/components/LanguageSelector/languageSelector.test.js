import React from 'react'

import {
    isolatedRender as render, fireEvent, screen, within,
} from '@utils/testing/testingLibrary'

import { LANGUAGE_KEYS } from 'src/i18n/languages'

import { isRadioSelected as isSelectedLanguageOptionHighlighted } from '@ui/atoms/RadioButton/radioButton.testUtils'

import LanguageSelector from './LanguageSelector'
import { LANGUAGE_OPTION_TEST_ID, SELECTED_OPTION_HIGHLIGHTER_TEST_ID } from './languageSelector.constants'

// have to prefix these with mock*, else jest throws error
const mockChangeLanguage = jest.fn(() => new Promise(() => { }))
const mockSelectedLanguageKey = LANGUAGE_KEYS.ENGLISH
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: str => str,
        i18n: {
            changeLanguage: mockChangeLanguage,
            language: mockSelectedLanguageKey,
        },
    }),
    initReactI18next: {
        type: '3rdParty',
        init: () => { },
    },
}))

describe('Language Selector Dialog', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('clicking on each language option will select that option', () => {
        const hideModal = jest.fn()
        render(<LanguageSelector hideModal={hideModal} />)

        const touchableparent = screen.getByTestId(LANGUAGE_OPTION_TEST_ID[LANGUAGE_KEYS.HINDI])
        const highlighterView = within(touchableparent).getByTestId(SELECTED_OPTION_HIGHLIGHTER_TEST_ID)

        expect(isSelectedLanguageOptionHighlighted(highlighterView)).toBe(false)

        fireEvent.press(touchableparent)

        expect(isSelectedLanguageOptionHighlighted(highlighterView)).toBe(true)
    })

    test('Cancel button will request to close the modal', () => {
        const hideModal = jest.fn()
        render(<LanguageSelector hideModal={hideModal} />)
        fireEvent.press(screen.getByText('Cancel'))
        expect(hideModal).toHaveBeenCalledTimes(1)
    })

    test('Save button will request to change the language and close the modal', () => {
        const hideModal = jest.fn()
        render(<LanguageSelector hideModal={hideModal} />)
        fireEvent.press(screen.getByText('Save'))

        expect(mockChangeLanguage).toHaveBeenCalledTimes(1)
        expect(hideModal).toHaveBeenCalledTimes(1)
    })

    test('Save button will request to change the language with newly selected language', () => {
        const hideModal = jest.fn()
        render(<LanguageSelector hideModal={hideModal} />)

        fireEvent.press(screen.getByText('हिंदी'))
        fireEvent.press(screen.getByText('Save'))
        // TODO: research if using 'हिंदी' and 'HINDI' label and key here
        //      is tapping into implementatin details or not
        expect(mockChangeLanguage).toHaveBeenCalledWith('HINDI')
    })
})
