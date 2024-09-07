import { getRouteParamValue } from 'src/navigation/navigation.utils'

import { ROUTES } from 'src/navigation/route.constants'

import { GameLevelsInfo } from '@application/usecases/gameLevels/type'
import { getGameLevelsUseCase } from '@application/usecases/gameLevels/gameLevels'

const onInit = async ({ setState, getState, params: dependencies }) => {
    const { route } = getState()
    const selectedLevel = getRouteParamValue('selectedGameMenuItem', route)
    getGameLevelsUseCase(selectedLevel, dependencies)
        .then(({ levels, nextPuzzleIndex, starsEarned, maxStars }: GameLevelsInfo) => {
            setState({ levels, levelToFocusIndex: nextPuzzleIndex, maxStars, starsEarned })
        })
}

// TODO: if this level is in resume game, then show resume button as well
// but show it as a low emphasis because from home screen, user ignored Resume button once
const onLevelClick = ({ getState, params: { levelNum } }) => {
    const { navigation, route } = getState()
    const selectedLevel = getRouteParamValue('selectedGameMenuItem', route)
    // TODO: show a dialog with current level infos etc etc
    navigation.navigate(ROUTES.ARENA, { selectedGameMenuItem: selectedLevel, levelNum })
}

const ACTION_TYPES = {
    ON_INIT: 'ON_INIT',
    ON_LEVEL_CLICK: 'ON_LEVEL_CLICK',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_INIT]: onInit,
    [ACTION_TYPES.ON_LEVEL_CLICK]: onLevelClick,
}

export { ACTION_TYPES, ACTION_HANDLERS }
