import { act, renderHook } from '@testing-library/react-hooks'

import { testStoreWrapper } from '../../../../utils/testingBoilerplate/reduxStoreWrapper'
import { makeTestStore } from '../../../../utils/testingBoilerplate/makeReduxStore'
import { GAME_STATE } from '../../../../resources/constants'

import { GAME_DATA_KEYS } from '../../utils/cacheGameHandler/constants'
import gameStateReducers, { gameStateActions } from '../../store/reducers/gameState.reducers'
const gameCacheUtils = require('../../utils/cacheGameHandler/cacheGameHandler')

import { useCacheGameState } from '../useCacheGameState'

const { setGameState } = gameStateActions

describe('useCacheGameState()', () => {
    test('saves game data in memory when game state is changes only from ACTIVE to NOT-ACTIVE', () => {
        const store = makeTestStore({ gameState: gameStateReducers })

        store.dispatch(setGameState(GAME_STATE.ACTIVE))

        const cacheHandlerSpy = jest.spyOn(gameCacheUtils, 'cacheGameData').mockImplementation(() => {})

        renderHook(({ key, data }) => useCacheGameState(key, data), {
            wrapper: testStoreWrapper,
            initialProps: {
                key: GAME_DATA_KEYS.STATE,
                data: 'some state',
                store,
            },
        })
        expect(cacheHandlerSpy).toHaveBeenCalledTimes(0)

        act(() => {
            store.dispatch(setGameState(GAME_STATE.GAME_SELECT))
        })
        expect(cacheHandlerSpy).toHaveBeenCalledTimes(1)

        act(() => {
            store.dispatch(setGameState(GAME_STATE.INACTIVE))
        })
        expect(cacheHandlerSpy).toHaveBeenCalledTimes(1)
    })
})
