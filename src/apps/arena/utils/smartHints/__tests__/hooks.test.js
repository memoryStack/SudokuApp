import { act, renderHook } from '@testing-library/react-hooks';

import { testStoreWrapper } from "../../../../../utils/testingBoilerplate/reduxStoreWrapper";
import { makeTestStore } from "../../../../../utils/testingBoilerplate/makeReduxStore";
import smartHintHCReducers, { smartHintHCActions } from "../../../store/reducers/smartHintHC.reducers";

import { useIsHintTryOutStep } from "../hooks";
import { mainNumbers, notesData } from '../hiddenGroup/testData';
import { HINTS_IDS } from '../constants';
import { getSmartHint } from '../../smartHint';
import boardReducers, { boardActions } from '../../../store/reducers/board.reducers';

const { setHints, setNextHint } = smartHintHCActions

const { setPossibleNotes } = boardActions

describe('useIsHintTryOutStep()', () => {
    test('returns false until tryout step is not reached by pressing next button', async () => {
        const store = makeTestStore({
            smartHintHC: smartHintHCReducers,
            board: boardReducers,
        })
        store.dispatch(setPossibleNotes(notesData))

        const { result } = renderHook(() => useIsHintTryOutStep(), {
            wrapper: testStoreWrapper,
            initialProps: { store }
        })
        expect(result.current).toBeFalsy()

        await act(async () => {
            const hints = await getSmartHint(mainNumbers, notesData, HINTS_IDS.HIDDEN_DOUBLE)
            store.dispatch(setHints({ hints }))
        })

        act((() => {
            store.dispatch(setNextHint())
        }))
        expect(result.current).toBeFalsy()

        act((() => {
            store.dispatch(setNextHint())
        }))
        expect(result.current).toBeTruthy()

    })
})
