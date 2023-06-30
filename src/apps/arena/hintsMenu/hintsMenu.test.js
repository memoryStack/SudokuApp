import * as React from 'react'

import {
    fireEvent, render, screen, waitFor,
} from '@utils/testing/testingLibrary'

import { getStoreState, invokeDispatch } from 'src/redux/dispatch.helpers'
import { expectOnHintMenuItems } from '@utils/testing/arena'

import { boardActions } from '../store/reducers/board.reducers'

import MainNumbers from './testData/mainNumbers.testData.json'
import Notes from './testData/notes.testData.json'
import PossibleNotes from './testData/possibleNotes.testData.json'
import { HINTS_MENU_OVERLAY_TEST_ID } from './hintsMenu.constants'
import { getHintsMenuVisibilityStatus } from '../store/selectors/boardController.selectors'
import { ACTION_TYPES } from './actionHandlers'
import { initMainNumbers, initNotes } from '../utils/util'
import { HintsMenu } from './index'

const { ACTION_HANDLERS } = require('./actionHandlers')

export const waitForAvailableHintsToBeChecked = async () => {
    // can we wait for it in a better way ??
    await waitFor(() => {
        let enabledHintsCount = 0
        expectOnHintMenuItems(element => {
            try {
                expect(element).not.toBeDisabled()
                enabledHintsCount++
            } catch (error) { }
        })

        expect(enabledHintsCount).not.toBe(0)
    })
}

const renderHintsMenu = async props => {
    invokeDispatch(boardActions.setMainNumbers(MainNumbers))
    invokeDispatch(boardActions.setNotes(Notes))
    invokeDispatch(boardActions.setPossibleNotes(PossibleNotes))

    render(<HintsMenu {...props} />)
    await waitForAvailableHintsToBeChecked()
}

describe('Available Hints Menu', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        // clear store
        invokeDispatch(boardActions.setMainNumbers(initMainNumbers()))
        invokeDispatch(boardActions.setNotes(initNotes()))
        invokeDispatch(boardActions.setPossibleNotes(initNotes()))
    })

    test('menu will be closed on overlay click', async () => {
        await renderHintsMenu()

        fireEvent.press(screen.getByTestId(HINTS_MENU_OVERLAY_TEST_ID))

        // TODO: decouple it with store
        expect(getHintsMenuVisibilityStatus(getStoreState())).toBe(false)
    })

    // TODO: this test-case is flawed/brittle, we are not waiting correctly until all the hints are checked
    // research for test-cases of this kind
    test('all hints will be disabled if notes are not present or not enough notes filled by user', async () => {
        jest.useRealTimers()

        invokeDispatch(boardActions.setMainNumbers(MainNumbers))

        render(<HintsMenu />)

        await new Promise(r => setTimeout(r, 2000))

        expectOnHintMenuItems(element => {
            expect(element).toBeDisabled()
        })
    })

    test('hint item will be disabled if it is not present in puzzle', async () => {
        const onMenuItemPressSpy = jest.spyOn(ACTION_HANDLERS, ACTION_TYPES.ON_MENU_ITEM_PRESS)
        await renderHintsMenu()

        fireEvent.press(screen.getByText('Y-Wing'))

        expect(onMenuItemPressSpy).not.toHaveBeenCalled()
    })

    test('hint item will be enabled if it is found in puzzle', async () => {
        const onMenuItemPressSpy = jest.spyOn(ACTION_HANDLERS, ACTION_TYPES.ON_MENU_ITEM_PRESS)
        await renderHintsMenu()

        fireEvent.press(screen.getByText('Naked Single'))

        expect(onMenuItemPressSpy).toHaveBeenCalledTimes(1)
    })

    test('hints menu will be closed after enabled hint item is clicked', async () => {
        await renderHintsMenu()

        fireEvent.press(screen.getByText('Naked Single'))

        expect(getHintsMenuVisibilityStatus(getStoreState())).toBe(false)
    })
})
