import {
    screen, fireEvent, act, within, waitFor
} from '@utils/testing/testingLibrary'

import { BADGE_TEST_ID } from '@ui/atoms/Badge'

import { fireLayoutEvent } from '@utils/testing/fireEvent.utils'

import { BOARD_CONTROLLER_CONTAINER_TEST_ID } from '../../apps/arena/cellActions/cellActions.constants'
import { waitForAvailableHintsToBeChecked } from '../../apps/arena/hintsMenu/hintsMenu.testingUtil'
import { INPUT_PANEL_CONTAINER_TEST_ID, INPUT_PANEL_ITEM_TEST_ID } from '../../apps/arena/inputPanel/constants'
import {
    SMART_HINT_HC_TEST_ID,
    CLOSE_ICON_TEST_ID as SMART_HINT_HC_CLOSE_ICON_TEST_ID,
    SMART_HINT_HC_BOTTOM_DRAGGER_CHILD_TEST_ID,
} from '../../apps/arena/smartHintHC/constants'
import { getFirstEmptyCell, isNotePresentInCell } from './arena'
import { isEmptyElement } from './touchable'
import { ARENA_INPUT_PANEL_CONTAINER_TEST_ID } from 'src/apps/arena/constants'

export const mockBoardControllersRef = async () => {
    // TODO: how to do it by mocking measure function mentioned
    // in "react-native/jest/MockNativeMethods"
    // this implementation contains implementatin details of the component and
    // it's fragile if my imlementation changes or if ReactNativeTestingLibrary changes
    // it's implementation
    // const boardControllerDimensionMeasurer = screen.UNSAFE_getByType(BoardController).props.refFromParent.current.measure
    /*
        UPDATE 1: have updated it once, spent around 30mins to make the change
    */
    await waitFor(async () => {
        const view = await screen.findByTestId(ARENA_INPUT_PANEL_CONTAINER_TEST_ID)
        const boardControllerDimensionMeasurer = view._fiber._debugOwner.ref.current.measure
        boardControllerDimensionMeasurer.mockImplementation(cb => {
            cb(0, 0, 392.72, 50.90, 0, 551.27)
        })
    })
}

export const openSmartHintHC = async hintItemToClick => {
    await mockBoardControllersRef()
    await waitFor(() => {
        expect(screen.queryByText('Fast Pencil')).toBeOnTheScreen()
    })
    await act(async () => {
        fireEvent.press(await screen.findByText('Fast Pencil'))
    })
    longPressHintCTA()
    await waitForAvailableHintsToBeChecked()
    fireEvent.press(screen.getByText(hintItemToClick))
    await waitFor(() => {
        screen.getByTestId(SMART_HINT_HC_TEST_ID)
    })

    measureSmartHintHC()
}

export const measureSmartHintHC = () => {
    act(() => {
        // event used by BottomDragger component to
        // measure child view dimensions
        fireLayoutEvent(screen.getByTestId(SMART_HINT_HC_BOTTOM_DRAGGER_CHILD_TEST_ID), {
            width: 400,
            height: 200,
            x: 0,
            y: 0,
        })
        // TODO: jest.runAllTimers(), jest.advanceTimersByTime() also works here
        //      need to understand the proper relation of these timers with Animated components
        // TODO: search why jest.runAllTimers() blocks the test cases and runs 1L timers
        // jest.runAllTimers()
        jest.advanceTimersByTime(200)
    })
}

export const gotoApplyHintStep = async () => {
    const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
    await waitFor(() => {
        try {
            smartHintHC.getByText('Apply Hint')
        } catch (error) {
            fireEvent.press(smartHintHC.getByText('Next'))
            throw new Error(error)
        }
    })
}

export const gotoTryOutStep = async () => {
    const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
    await waitFor(() => {
        try {
            smartHintHC.getAllByTestId(INPUT_PANEL_ITEM_TEST_ID)
        } catch (error) {
            fireEvent.press(smartHintHC.getByText('Next'))
            throw new Error(error)
        }
    })
}

export const getInputPanel = () => {
    const smartHintHC = within(screen.getByTestId(SMART_HINT_HC_TEST_ID))
    return within(smartHintHC.getByTestId(INPUT_PANEL_CONTAINER_TEST_ID))
}

export const closeSmartHintHC = () => {
    act(() => {
        fireEvent.press(screen.getByTestId(SMART_HINT_HC_CLOSE_ICON_TEST_ID))
        jest.advanceTimersByTime(200)
    })
}

export const assertHintsLeft = hintsLeft => {
    const boardController = within(screen.getByTestId(BOARD_CONTROLLER_CONTAINER_TEST_ID))
    boardController.getByTestId(BADGE_TEST_ID)
    expect(boardController.getByTestId(BADGE_TEST_ID)).toHaveTextContent(hintsLeft)
}

export const applyHint = async hint => {
    await openSmartHintHC(hint)
    await gotoApplyHintStep()
    act(() => {
        fireEvent.press(screen.getByText('Apply Hint'))
        jest.advanceTimersByTime(500)
    })
}

export const longPressHintCTA = () => {
    fireEvent(screen.getByText('Hint'), 'onLongPress')
}
