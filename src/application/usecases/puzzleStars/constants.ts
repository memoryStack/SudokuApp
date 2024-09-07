import { NEW_GAME_IDS } from "../newGameMenu/constants"

const TIME_LIMIT_FOR_ONE_STAR = 100000000

// this timeLimit is in minutes
export const PUZZLE_STARS_DISTRIBUTION = {
    [NEW_GAME_IDS.EASY]: [{ stars: 3, timeLimit: 20 }, { stars: 2, timeLimit: 30 }, { stars: 1, timeLimit: TIME_LIMIT_FOR_ONE_STAR }],
    [NEW_GAME_IDS.MEDIUM]: [{ stars: 3, timeLimit: 30 }, { stars: 2, timeLimit: 40 }, { stars: 1, timeLimit: TIME_LIMIT_FOR_ONE_STAR }],
    [NEW_GAME_IDS.HARD]: [{ stars: 3, timeLimit: 40 }, { stars: 2, timeLimit: 50 }, { stars: 1, timeLimit: TIME_LIMIT_FOR_ONE_STAR }],
    [NEW_GAME_IDS.EXPERT]: [{ stars: 3, timeLimit: 50 }, { stars: 2, timeLimit: 60 }, { stars: 1, timeLimit: TIME_LIMIT_FOR_ONE_STAR }]
}
