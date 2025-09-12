import { LEVEL_STATES } from "./constants"

export type Level = {
    state: LEVEL_STATES,
    activeStars: number,
    levelNum: number,
    unsolved?: boolean
}

export type GameLevelsInfo = {
    levels: Level[]
    nextPuzzleIndex: number
    starsEarned: number
    maxStars: number
}
