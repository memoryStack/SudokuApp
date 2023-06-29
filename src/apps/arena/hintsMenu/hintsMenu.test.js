import * as React from 'react'

import {
    fireEvent, render, screen, waitFor,
} from '@utils/testing/testingLibrary'

import { getStoreState, invokeDispatch } from 'src/redux/dispatch.helpers'
import { expectOnHintMenuItems } from '@utils/testing/arena' // move this to local folder
import { HintsMenu } from './index'
import { boardActions } from '../store/reducers/board.reducers'

import MainNumbers from './testData/mainNumbers.testData.json'
import Notes from './testData/notes.testData.json'
import PossibleNotes from './testData/possibleNotes.testData.json'
import { HINTS_MENU_OVERLAY_TEST_ID } from './hintsMenu.constants'
import { getHintsMenuVisibilityStatus } from '../store/selectors/boardController.selectors'
import { ACTION_TYPES } from './actionHandlers'

const { ACTION_HANDLERS } = require('./actionHandlers')

const renderHintsMenu = async props => {
    invokeDispatch(boardActions.setMainNumbers(MainNumbers))
    invokeDispatch(boardActions.setNotes(Notes))
    invokeDispatch(boardActions.setPossibleNotes(PossibleNotes))

    render(<HintsMenu {...props} />)

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

describe('Available Hints Menu', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('menu will be closed on overlay click', async () => {
        await renderHintsMenu()

        fireEvent.press(screen.getByTestId(HINTS_MENU_OVERLAY_TEST_ID))

        // TODO: decouple it with store
        expect(getHintsMenuVisibilityStatus(getStoreState())).toBe(false)
    })

    test('menu item will not be clicked if disabled', async () => {
        const onMenuItemPressSpy = jest.spyOn(ACTION_HANDLERS, ACTION_TYPES.ON_MENU_ITEM_PRESS)
        await renderHintsMenu()

        fireEvent.press(screen.getByText('Y-Wing'))

        expect(onMenuItemPressSpy).not.toHaveBeenCalled()
    })

    test('menu item will clicked if enabled and will request to close the hints menu', async () => {
        const onMenuItemPressSpy = jest.spyOn(ACTION_HANDLERS, ACTION_TYPES.ON_MENU_ITEM_PRESS)
        await renderHintsMenu()

        fireEvent.press(screen.getByText('Naked Single'))

        expect(onMenuItemPressSpy).toHaveBeenCalledTimes(1)
    })

    test('hints menu will be closed after enabled hint is clicked', async () => {
        await renderHintsMenu()

        fireEvent.press(screen.getByText('Naked Single'))

        expect(getHintsMenuVisibilityStatus(getStoreState())).toBe(false)
    })
})
