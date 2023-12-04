import { refreeActions } from '../../apps/arena/store/reducers/refree.reducers'
import { getMistakes, getDifficultyLevel, getTime } from '../../apps/arena/store/selectors/refree.selectors'

import { getStoreState, invokeDispatch } from '../../redux/dispatch.helpers'

import type {
    DefaultState,
    RefreeRepository as RefreeRepositoryInterface,
    Time,
} from '../../interfaces/refreeRepository'

const {
    setMistakes,
    setDifficultylevel,
    setTime,
    setState,
} = refreeActions

export const RefreeRepository: RefreeRepositoryInterface = {
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
    setState: (newState: DefaultState) => {
        invokeDispatch(setState(newState))
    },
}
