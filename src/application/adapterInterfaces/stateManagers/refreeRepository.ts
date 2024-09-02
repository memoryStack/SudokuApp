import { NEW_GAME_IDS } from "@application/usecases/newGameMenu/constants"

// this interface is defined by domain
export type Time = {
    hours: number
    seconds: number
    minutes: number
}

export type DefaultState = {
    maxMistakesLimit: number,
    mistakes: number,
    difficultyLevel: NEW_GAME_IDS,
    time: Time
}

export interface RefreeRepository {
    getGameMistakesCount: () => number;
    setGameMistakesCount: (mistakes: number) => void;
    getMaxMistakesCount: () => number;
    getGameLevel: () => NEW_GAME_IDS;
    setGameLevel: (level: NEW_GAME_IDS) => void;
    getTime: () => Time;
    setTime: (time: Time) => void;
    setState: (state: DefaultState) => void;
    getGameLevelNumber: () => number;
    setGameLevelNumber: (levelNum: number) => void;
}
