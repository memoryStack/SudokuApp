import { GameDataToPersist } from "@application/adapterInterfaces/gamePersistenceAdapter";
import { GAME_STATE } from "@application/constants";
import { Dependencies } from "@application/type";
import { GameState } from "@application/utils/gameState";
import { GAME_DATA_KEYS } from "src/apps/arena/utils/cacheGameHandler"; // VIOLATION OF DIP

export const shouldSaveDataOnGameStateChange = (currentState: GAME_STATE, previousState: GAME_STATE) =>
    new GameState(previousState).isGameActive() && !new GameState(currentState).isGameActive()

const persistGameData = (
    currentGameState: GAME_STATE,
    previousGameState: GAME_STATE,
    dependencies: Dependencies
) => {
    if (!shouldSaveDataOnGameStateChange(currentGameState, previousGameState)) return

    const {
        gameStateRepository,
        refreeRepository,
        boardRepository,
        boardControllerRepository,
        gamePersistenceAdapter,
    } = dependencies

    const dataToBeCached: GameDataToPersist = {
        [GAME_DATA_KEYS.STATE]: gameStateRepository.getGameState(),
        [GAME_DATA_KEYS.REFEREE]: {
            difficultyLevel: refreeRepository.getGameLevel(),
            mistakes: refreeRepository.getGameMistakesCount(),
            time: refreeRepository.getTime(),
        },
        [GAME_DATA_KEYS.BOARD_DATA]: {
            mainNumbers: boardRepository.getMainNumbers(),
            notes: boardRepository.getNotes(),
            moves: boardRepository.getMoves(),
            selectedCell: boardRepository.getSelectedCell(),
        },
        [GAME_DATA_KEYS.CELL_ACTIONS]: {
            pencilState: boardControllerRepository.getPencil(),
            hints: boardControllerRepository.getHintsLeftCount()
        }
    }

    gamePersistenceAdapter.persistGameData(dataToBeCached)
}

export const pauseGame = (currentGameState: GAME_STATE, dependencies: Dependencies) => {
    if (!new GameState(currentGameState).isGameActive()) return

    const { gameStateRepository } = dependencies
    gameStateRepository.setGameState(GAME_STATE.INACTIVE)
    const previousGameState = currentGameState
    persistGameData(GAME_STATE.INACTIVE, previousGameState, dependencies)
}
