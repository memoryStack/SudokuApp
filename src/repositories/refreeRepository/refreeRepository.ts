import { refreeActions } from '../../apps/arena/store/reducers/refree.reducers'
import { getMistakes, getDifficultyLevel, getTime, getMaxMistakesLimit, getLevelNumber, getLastActivityTime } from '../../apps/arena/store/selectors/refree.selectors'

import { getStoreState, invokeDispatch } from '../../redux/dispatch.helpers'

import type {
    DefaultState,
    RefreeRepository as RefreeRepositoryInterface,
    Time,
} from '@application/adapterInterfaces/stateManagers/refreeRepository'

export const createRefreeStateRepositoryHandlers = (actions, stateReaders): RefreeRepositoryInterface => {
    const {
        setMistakes,
        setDifficultylevel,
        setTime,
        setState,
        setLevelNumber,
        setLastActivityTime
    } = actions

    const {
        getMistakes, getDifficultyLevel, getTime, getMaxMistakesLimit, getLevelNumber, getLastActivityTime
    } = stateReaders

    return {
        getMaxMistakesCount: () => getMaxMistakesLimit(getStoreState()),
        getGameMistakesCount: () => getMistakes(getStoreState()),
        setGameMistakesCount: (mistakes: number) => {
            invokeDispatch(setMistakes(mistakes))
        },
        getGameLevel: () => getDifficultyLevel(getStoreState()),
        // TODO: check it's type properly for 4 levels and custom and shared puzzle as well
        setGameLevel: (level: string) => {
            invokeDispatch(setDifficultylevel(level))
        },
        getTime: () => getTime(getStoreState()),
        setTime: (time: Time) => {
            invokeDispatch(setTime(time))
        },
        getLastActivityTime: () => getLastActivityTime(getStoreState()),
        setLastActivityTime: (time: Time) => {
            invokeDispatch(setLastActivityTime(time))
        },
        setState: (newState: DefaultState) => {
            invokeDispatch(setState(newState))
        },
        getGameLevelNumber: () => {
            return getLevelNumber(getStoreState())
        },
        setGameLevelNumber: (levelNum: number) => {
            invokeDispatch(setLevelNumber(levelNum))
        }
    }
}

export const RefreeRepository = createRefreeStateRepositoryHandlers(refreeActions, {
    getMistakes, getDifficultyLevel, getTime, getMaxMistakesLimit, getLevelNumber, getLastActivityTime
})
