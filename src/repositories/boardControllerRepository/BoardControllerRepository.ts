import { PENCIL_STATE } from '@resources/constants'

import { MAX_AVAILABLE_HINTS } from '../../apps/arena/store/state/boardController.state'
import { getAvailableHintsCount, getPencilStatus, getHintsUsed } from '../../apps/arena/store/selectors/boardController.selectors'
import { boardControllerActions } from '../../apps/arena/store/reducers/boardController.reducers'
import { getStoreState, invokeDispatch } from '../../redux/dispatch.helpers'

import type {
    BoardControllerRepository as BoardControllerRepositoryInterface,
} from '@application/adapterInterfaces/stateManagers/boardControllerRepository'

const {
    setPencil, setHints, resetState, setHintsMenu, incrementHintsUsed, setHintsUsed
} = boardControllerActions

export const BoardControllerRepository: BoardControllerRepositoryInterface = {
    getHintsLeftCount: () => getAvailableHintsCount(getStoreState()) as number,
    resetState: () => {
        const state = {
            pencilState: PENCIL_STATE.INACTIVE,
            hintsLeft: MAX_AVAILABLE_HINTS,
            showHintsMenu: false,
            hintsUsed: 0,
        }
        invokeDispatch(resetState(state))
    },
    setHintsLeftCount: (hintsLeft: number) => {
        invokeDispatch(setHints(hintsLeft))
    },
    setPencil: (pencilState: PENCIL_STATE) => {
        invokeDispatch(setPencil(pencilState))
    },
    getPencil: () => getPencilStatus(getStoreState()) as PENCIL_STATE,
    setHintsMenuVisibility: (visible: boolean) => {
        invokeDispatch(setHintsMenu(visible))
    },
    incrementHintsUsed: () => {
        invokeDispatch(incrementHintsUsed())
    },
    getHintsUsed: () => getHintsUsed(getStoreState()),
    setHintsUsed: (hintsUsed: number) => invokeDispatch(setHintsUsed(hintsUsed))
}
