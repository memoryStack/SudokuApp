import { inputPanelActions } from '../../apps/arena/store/reducers/inputPanel.reducers'

import { getIsNumberLocked, getLockedNumber } from '../../apps/arena/store/selectors/inputPanel.selectors'

import { getStoreState, invokeDispatch } from '../../redux/dispatch.helpers'

import type {
    InputPanelRepository as InputPanelRepositoryInterface,
    LockNumber
} from '@application/adapterInterfaces/stateManagers/inputPanelRepository'

export const createInputPanelStateRepositoryHandlers = (inputPanelActions, stateReaders): InputPanelRepositoryInterface => {
    const {
        setLockedNumber,
        unlockNumber
    } = inputPanelActions

    const {
        getIsNumberLocked,
        getLockedNumber
    } = stateReaders

    return {
        setLockedNumber: (lockNumber: LockNumber) => {
            invokeDispatch(setLockedNumber(lockNumber))
        },
        unlockNumber: () => {
            invokeDispatch(unlockNumber())
        },
        getIsNumberLocked: () => getIsNumberLocked(getStoreState()),
        getLockedNumber: () => getLockedNumber(getStoreState())
    }
}

export const InputPanelRepository = createInputPanelStateRepositoryHandlers(inputPanelActions, {
    getIsNumberLocked, getLockedNumber
})
