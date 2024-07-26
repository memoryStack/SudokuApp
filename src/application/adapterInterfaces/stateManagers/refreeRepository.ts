// this interface is defined by domain
export type Time = {
    hours: number
    seconds: number
    minutes: number
}

export type DefaultState = {
    maxMistakesLimit: number,
    mistakes: number,
    difficultyLevel: string,
    time: Time
}

export interface RefreeRepository {
    getGameMistakesCount: () => number;
    setGameMistakesCount: (mistakes: number) => void;
    getMaxMistakesCount: () => number;
    getGameLevel: () => string;
    setGameLevel: (level: string) => void;
    getTime: () => Time;
    setTime: (time: Time) => void;
    setState: (state: DefaultState) => void;
}
