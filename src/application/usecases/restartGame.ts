import { Dependencies } from "../type";
import { startGameUseCase } from "./startGameUseCase";
import { MainNumbersRecord } from "@domain/board/records/mainNumbersRecord";
import { transformRawPuzzleToStateMainNumbers } from "@domain/board/utils/puzzleDataTransformers";

export const restartGame = (dependencies: Dependencies) => {
    const { refreeRepository, boardRepository, analytics } = dependencies

    const mainNumbers = boardRepository.getMainNumbers()
    const clues = MainNumbersRecord.getOriginalPuzzleMainNumbers(mainNumbers)
    const solution = MainNumbersRecord.getOriginalSolution(mainNumbers)

    startGameUseCase({
        mainNumbers: transformRawPuzzleToStateMainNumbers({ clues, solution }),
        difficultyLevel: refreeRepository.getGameLevel(),
        levelNum: refreeRepository.getGameLevelNumber(),
        dependencies
    })

    analytics?.sendPuzzleLifeCycleEvent?.({
        puzzle: boardRepository.getPuzzleString(),
        level: refreeRepository.getGameLevel(),
        status: 'RESTART'
    })
}
