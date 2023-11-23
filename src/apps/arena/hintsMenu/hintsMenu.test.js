import * as React from 'react'

import {
    fireEvent, render, screen, act,
} from '@utils/testing/testingLibrary'

import { getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'

import { getStoreState, invokeDispatch } from '../../../redux/dispatch.helpers'

import { boardActions } from '../store/reducers/board.reducers'
import { HINTS_MENU_OVERLAY_TEST_ID } from './hintsMenu.constants'
import { getHintsMenuVisibilityStatus } from '../store/selectors/boardController.selectors'
import { MainNumbersRecord } from '../RecordUtilities/boardMainNumbers'
import { NotesRecord } from '../RecordUtilities/boardNotes'

import { ACTION_TYPES } from './actionHandlers'
import { HintsMenu } from './index'
import { expectOnHintMenuItems, waitForAvailableHintsToBeChecked } from './hintsMenu.testingUtil'

const { ACTION_HANDLERS } = require('./actionHandlers')

const renderHintsMenu = async props => {
    render(<HintsMenu {...props} />)

    act(() => {
        const puzzle = '900008000000004027061027000095000004080010090600000780000850140850600000000300002'
        const { mainNumbers, notes } = getPuzzleDataFromPuzzleString(puzzle)
        invokeDispatch(boardActions.setMainNumbers(mainNumbers))
        invokeDispatch(boardActions.setNotes(notes))
    })

    await waitForAvailableHintsToBeChecked()
}

describe('Available Hints Menu', () => {
    afterEach(() => {
        jest.clearAllMocks()
        invokeDispatch(boardActions.setMainNumbers(MainNumbersRecord.initMainNumbers()))
        invokeDispatch(boardActions.setNotes(NotesRecord.initNotes()))
    })

    test('hints menu will contain these hints', async () => {
        await renderHintsMenu()

        screen.getByText('Naked\nSingle')
        screen.getByText('Hidden\nSingle')
        screen.getByText('Naked\nDouble')
        screen.getByText('Hidden\nDouble')
        screen.getByText('Naked\nTripple')
        screen.getByText('Hidden\nTripple')
        screen.getByText('X-Wing')
        screen.getByText('Y-Wing')
        screen.getByText('Omission')
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
        const puzzle = '900008000000004027061027000095000004080010090600000780000850140850600000000300002'
        const { mainNumbers } = getPuzzleDataFromPuzzleString(puzzle)
        invokeDispatch(boardActions.setMainNumbers(mainNumbers))

        render(<HintsMenu />)

        await new Promise(resolve => { setTimeout(resolve, 2000) })

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
