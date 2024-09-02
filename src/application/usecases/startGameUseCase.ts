import { NotesRecord } from "@domain/board/records/notesRecord"

import { MAX_AVAILABLE_HINTS } from "src/apps/arena/store/state/boardController.state" // DIP violation
import { Move } from "../adapterInterfaces/stateManagers/boardRepository"
import { GAME_STATE, PENCIL_STATE } from "../constants"
import { Dependencies } from "../type"
import { NEW_GAME_IDS } from "./newGameMenu/constants"

// TODO: manage this Time type properly, m sure it's getting used at multiple places
type Time = {
    hours: number,
    minutes: number,
    seconds: number
}

export type StartGameData = {
    mainNumbers: MainNumbers
    difficultyLevel: NEW_GAME_IDS
    levelNum?: number
    notes?: Notes
    selectedCell?: Cell
    moves?: Move[]
    mistakes?: number
    time?: Time
    pencilState?: PENCIL_STATE
    hints?: number
    hintsUsed?: number
    dependencies: Dependencies
}

export const startGameUseCase = ({
    mainNumbers,
    difficultyLevel,
    notes = NotesRecord.initNotes(),
    selectedCell = { row: 0, col: 0 },
    levelNum = 0,
    moves = [],
    mistakes = 0,
    time = { hours: 0, minutes: 0, seconds: 0 },
    pencilState = PENCIL_STATE.INACTIVE,
    dependencies,
    hints: hintsLeft = MAX_AVAILABLE_HINTS,
    hintsUsed = 0,
}: StartGameData) => {
    const {
        boardRepository, refreeRepository, gameStateRepository, boardControllerRepository,
    } = dependencies

    boardRepository.setState({ mainNumbers, notes, selectedCell, moves })

    refreeRepository.setGameLevel(difficultyLevel)
    refreeRepository.setGameMistakesCount(mistakes)
    refreeRepository.setTime(time)
    refreeRepository.setGameLevelNumber(levelNum)

    boardControllerRepository.setPencil(pencilState || PENCIL_STATE.INACTIVE)
    boardControllerRepository.setHintsLeftCount(hintsLeft)
    boardControllerRepository.setHintsUsed(hintsUsed)

    gameStateRepository.setGameState(GAME_STATE.ACTIVE)
}
