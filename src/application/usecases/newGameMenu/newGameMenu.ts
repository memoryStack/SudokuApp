

// this interface has to be implemented by the UI/Ploc layer

import _includes from "@lodash/includes"
import _values from "@lodash/values"

import { GAME_STATE } from "../../constants"

import { generateAndStartNewGameUseCase } from "../generateAndStartNewGame"
import { resumeGameUseCase } from "../resumeGame"
import { Dependencies } from "@application/type"
import { AUTO_GENERATED_NEW_GAME_IDS, START_GAME_MENU_ITEMS_IDS } from "./constants"

// and this usecase will use this
// the toggler can be implemented by any means, either via local state
// or via global state or any other how.


export const isGenerateNewPuzzleItem = (itemId: START_GAME_MENU_ITEMS_IDS) => {
    const newGameMenuItems = [
        AUTO_GENERATED_NEW_GAME_IDS.EASY,
        AUTO_GENERATED_NEW_GAME_IDS.MEDIUM,
        AUTO_GENERATED_NEW_GAME_IDS.HARD,
        AUTO_GENERATED_NEW_GAME_IDS.EXPERT,
    ]
    return newGameMenuItems.includes(itemId as unknown as AUTO_GENERATED_NEW_GAME_IDS)
}

export const handleMenuItemPress = (
    itemId: START_GAME_MENU_ITEMS_IDS,
    dependencies: Dependencies
) => {
    const { customPuzzleInputToggler } = dependencies

    if (isGenerateNewPuzzleItem(itemId)) {
        // TODO: test this behaviour properly like
        // what would happen if i change the order or keys in these two enums
        generateAndStartNewGameUseCase(itemId as unknown as AUTO_GENERATED_NEW_GAME_IDS, dependencies)
        return
    }

    if (itemId === START_GAME_MENU_ITEMS_IDS.RESUME) {
        resumeGameUseCase(dependencies)
        return
    }

    if (itemId === START_GAME_MENU_ITEMS_IDS.CUSTOMIZE_PUZZLE) {
        customPuzzleInputToggler.open()
        return
    }

    generateAndStartNewGameUseCase(AUTO_GENERATED_NEW_GAME_IDS.EASY, dependencies)
}

export const getMenuItemsToShow = async (dependencies: Dependencies) => {
    const { pausedGameAdapter } = dependencies

    const defaultMenuItems = [
        START_GAME_MENU_ITEMS_IDS.EASY,
        START_GAME_MENU_ITEMS_IDS.MEDIUM,
        START_GAME_MENU_ITEMS_IDS.HARD,
        START_GAME_MENU_ITEMS_IDS.EXPERT,
        START_GAME_MENU_ITEMS_IDS.CUSTOMIZE_PUZZLE,
    ]

    return pausedGameAdapter.getPausedGameData()
        .then((pausedGameData) => {
            const { gameState: pausedGameState } = pausedGameData || {}
            const pausedGameExists = [GAME_STATE.INACTIVE, GAME_STATE.DISPLAY_HINT].includes(pausedGameState)
            if (pausedGameExists) defaultMenuItems.push(START_GAME_MENU_ITEMS_IDS.RESUME)
            return defaultMenuItems
        })
        .catch((error) => {
            return defaultMenuItems
        })
}
