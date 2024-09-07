import { GameLevelsInfo } from '@application/usecases/gameLevels/type'
import { getGameLevelsUseCase } from '@application/usecases/gameLevels/gameLevels'

const onInit = async ({ setState, getState, params: dependencies }) => {
    const { puzzleType } = getState()
    getGameLevelsUseCase(puzzleType, dependencies)
        .then(({ levels, nextPuzzleIndex, starsEarned, maxStars }: GameLevelsInfo) => {
            setState({ levels, levelToFocusIndex: nextPuzzleIndex, maxStars, starsEarned })
        })
}

const ACTION_TYPES = {
    ON_INIT: 'ON_INIT'
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_INIT]: onInit,
}

export { ACTION_TYPES, ACTION_HANDLERS }
