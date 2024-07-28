import type { Dependencies } from '../type'

import { startGameUseCase } from "./startGameUseCase"

import type { PausedGameData } from '../adapterInterfaces/pausedGame'

export const resumeGameUseCase = async (dependencies: Dependencies) => {

    const { pausedGameAdapter } = dependencies

    // TODO: to tell ts that this value will not be null
    pausedGameAdapter.getPausedGameData()
        .then((pausedGameData: PausedGameData) => {
            startGameUseCase({
                ...pausedGameData,
                dependencies,
            })
            pausedGameAdapter.removePausedGameData()
        })
        .catch((error) => {
            // start some other game
        })
}
