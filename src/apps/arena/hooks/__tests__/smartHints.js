import { getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'

import { act, renderHook } from '@testing-library/react-hooks'

import { makeTestStore } from '@utils/testing/testingBoilerplate/makeReduxStore'

import { testStoreWrapper } from '@utils/testing/testingBoilerplate/reduxStoreWrapper'
import smartHintHCReducers, { smartHintHCActions } from '../../store/reducers/smartHintHC.reducers'

import { useIsHintTryOutStep } from '../smartHints'

import boardReducers from '../../store/reducers/board.reducers'
import { HINTS_IDS } from '../../utils/smartHints/constants'
import { getRawHints } from '../../utils/smartHints'

const { setHints, setNextHint } = smartHintHCActions

// TODO: this test-case will be changed now due to implementation
// i guess this is what we call testing the implementation. lol ??
describe.skip('useIsHintTryOutStep()', () => {
    test('returns false until tryout step is not reached by pressing next button', async () => {
        const store = makeTestStore({
            smartHintHC: smartHintHCReducers,
            board: boardReducers,
        })

        const puzzle = '400372196002000870970000400503001760090037504207000300600003907009700240720950600'
        const { mainNumbers, notes } = getPuzzleDataFromPuzzleString(puzzle)

        const { result } = renderHook(() => useIsHintTryOutStep(), {
            wrapper: testStoreWrapper,
            initialProps: { store },
        })
        expect(result.current).toBeFalsy()

        await act(async () => {
            const hints = await getRawHints(HINTS_IDS.HIDDEN_DOUBLE, mainNumbers, notes)
            store.dispatch(setHints({ hints }))
        })

        act(() => {
            store.dispatch(setNextHint())
        })
        expect(result.current).toBeFalsy()

        act(() => {
            store.dispatch(setNextHint())
        })
        expect(result.current).toBeTruthy()
    })
})
