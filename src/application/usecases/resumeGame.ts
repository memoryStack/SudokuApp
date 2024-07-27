import type { Dependencies } from '../type'

import { startGameUseCase } from "./startGameUseCase"

import type { PausedGameData } from '../adapterInterfaces/pausedGameDataGetter'

export const resumeGameUseCase = async (dependencies: Dependencies) => {

    const { getPausedGameData } = dependencies

    getPausedGameData()
        .then((pausedGameData: PausedGameData) => {
            startGameUseCase({
                ...pausedGameData,
                dependencies,
            })
        })
        .catch((error) => {
            // start some other game
        })
}
