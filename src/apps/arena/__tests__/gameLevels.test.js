import {
    waitFor, act,
} from '@utils/testing/testingLibrary'

import {
    solvePuzzle,
    gameOverByMistakes,
    renderScreenAndWaitForPuzzleStart,
} from '@utils/testing/arena'

import { LEVEL_STATES } from '@application/usecases/gameLevels/constants'
import { server } from 'src/mocks/node'
import { gameLevelsAdapter } from '@adapters/gameLevelsAdapter'
import { AUTO_GENERATED_NEW_GAME_IDS } from '@application/usecases/newGameMenu/constants'

jest.mock('@adapters/gameSettings', () => {
    const originalModule = jest.requireActual('@adapters/gameSettings');
    return {
        gameSettingsAdapter: {
            ...originalModule.gameSettingsAdapter,
            shouldGameOverOnMistakesThresholdCrossed: jest.fn(() => true),
        }
    }
})

jest.mock('@adapters/gameLevelsAdapter', () => {
    const originalModule = jest.requireActual('@adapters/gameLevelsAdapter');
    return {
        gameLevelsAdapter: {
            ...originalModule.gameLevelsAdapter,
            getGameLevels: jest.fn(),
            getLevelCompletedGames: jest.fn(),
            saveLevelCompletedGames: jest.fn()
        }
    }
})

jest.mock('lottie-react-native', () => {
    const MockComponent = () => {
        return null
    }
    return {
        __esModule: true,
        default: MockComponent
    }
})

jest.mock('../../../adapters/puzzle', () => {
    const originalPuzzleModule = jest.requireActual('../../../adapters/puzzle')
    const { transformRawPuzzleToStateMainNumbers } = jest.requireActual('@domain/board/utils/puzzleDataTransformers')

    const Puzzle = {
        ...originalPuzzleModule.Puzzle,
        getSudokuPuzzle: () => Promise.resolve(
            transformRawPuzzleToStateMainNumbers({
                clues: [9, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 2, 7, 0, 6, 1, 0, 2, 7, 0, 0, 0, 0, 9, 5, 0, 0, 0, 0, 0, 4, 0, 8, 0, 0, 1, 0, 0, 9, 0, 6, 0, 0, 0, 0, 0, 7, 8, 0, 0, 0, 0, 8, 5, 0, 1, 4, 0, 8, 5, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 2],
                solution: [9, 2, 7, 5, 3, 8, 4, 6, 1, 5, 3, 8, 1, 6, 4, 9, 2, 7, 4, 6, 1, 9, 2, 7, 5, 3, 8, 2, 9, 5, 7, 8, 3, 6, 1, 4, 7, 8, 3, 4, 1, 6, 2, 9, 5, 6, 1, 4, 2, 9, 5, 7, 8, 3, 3, 7, 9, 8, 5, 2, 1, 4, 6, 8, 5, 2, 6, 4, 1, 3, 7, 9, 1, 4, 6, 3, 7, 9, 8, 5, 2],
            })),
        validatePuzzle: jest.fn(),
    }
    return { Puzzle }
})

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe.only('GameLevels On Game Over', () => {
    beforeEach(() => {
        jest.useFakeTimers({
            doNotFake: ['nextTick'], // Allows waitFor to work
            timerLimit: 100, // Optional safety measure
        })

        gameLevelsAdapter.getGameLevels.mockImplementation(() => {
            return {
                levels: [{
                    levelNum: 3,
                    activeStars: 2,
                    state: LEVEL_STATES.COMPLETED,
                    unsolved: false
                }],
                starsEarned: 3
            }
        })

        gameLevelsAdapter.getLevelCompletedGames.mockImplementation(() => {
            return {
                levels: [
                    {
                        level: AUTO_GENERATED_NEW_GAME_IDS.EASY,
                        levelNum: 3,
                        starsEarned: 3,
                        mistakes: 1,
                        time: { hours: 0, minutes: 0, seconds: 45 },
                        hintsUsed: 2
                    }
                ],
                unsolvedLevels: [],
                totalStarsEarned: 3,
                bestTime: { hours: 0, minutes: 0, seconds: 0 }
            }
        })
    })

    afterEach(() => {
        jest.useRealTimers()
        jest.clearAllMocks()
    })

    test('should update the solved game levels when a new game is solved', async () => {
        await renderScreenAndWaitForPuzzleStart()

        solvePuzzle()

        await waitFor(() => {
            expect(gameLevelsAdapter.saveLevelCompletedGames).toHaveBeenCalledWith(
                AUTO_GENERATED_NEW_GAME_IDS.EASY,
                {
                    bestTime: { hours: 0, minutes: 0, seconds: 0 },
                    totalStarsEarned: 6,
                    unsolvedLevels: [],
                    levels: [
                        {
                            level: AUTO_GENERATED_NEW_GAME_IDS.EASY,
                            levelNum: 3,
                            starsEarned: 3,
                            mistakes: 1,
                            time: { hours: 0, minutes: 0, seconds: 45 },
                            hintsUsed: 2
                        },
                        {
                            hintsUsed: 0,
                            level: AUTO_GENERATED_NEW_GAME_IDS.EASY,
                            levelNum: 1,
                            mistakes: 0,
                            starsEarned: 3,
                            time: { hours: 0, minutes: 0, seconds: 0 }
                        }
                    ]
                }
            )
        })
    })

    test('should update the game as solved when an unsolved game is solved', async () => {
        gameLevelsAdapter.getGameLevels.mockImplementation(() => {
            return {
                levels: [
                    {
                        levelNum: 3,
                        activeStars: 2,
                        state: LEVEL_STATES.COMPLETED,
                        unsolved: false
                    },
                    {
                        levelNum: 1,
                        activeStars: 0,
                        state: LEVEL_STATES.LOCKED,
                        unsolved: true
                    }
                ],
                starsEarned: 3
            }
        })

        gameLevelsAdapter.getLevelCompletedGames.mockImplementation(() => {
            return {
                levels: [
                    {
                        level: AUTO_GENERATED_NEW_GAME_IDS.EASY,
                        levelNum: 3,
                        starsEarned: 3,
                        mistakes: 1,
                        time: { hours: 0, minutes: 0, seconds: 45 },
                        hintsUsed: 2
                    },
                    {
                        level: AUTO_GENERATED_NEW_GAME_IDS.EASY,
                        levelNum: 1,
                        starsEarned: 0,
                        mistakes: 3,
                        time: { hours: 0, minutes: 0, seconds: 45 },
                        hintsUsed: 3
                    }
                ],
                unsolvedLevels: [1],
                totalStarsEarned: 3,
                bestTime: { hours: 0, minutes: 0, seconds: 0 }
            }
        })

        await renderScreenAndWaitForPuzzleStart()

        solvePuzzle()

        await waitFor(() => {
            expect(gameLevelsAdapter.saveLevelCompletedGames).toHaveBeenCalledWith(
                AUTO_GENERATED_NEW_GAME_IDS.EASY,
                {
                    bestTime: { hours: 0, minutes: 0, seconds: 0 },
                    totalStarsEarned: 6,
                    unsolvedLevels: [],
                    levels: [
                        {
                            level: AUTO_GENERATED_NEW_GAME_IDS.EASY,
                            levelNum: 3,
                            starsEarned: 3,
                            mistakes: 1,
                            time: { hours: 0, minutes: 0, seconds: 45 },
                            hintsUsed: 2
                        },
                        {
                            hintsUsed: 0,
                            level: AUTO_GENERATED_NEW_GAME_IDS.EASY,
                            levelNum: 1,
                            mistakes: 0,
                            starsEarned: 3,
                            time: { hours: 0, minutes: 0, seconds: 0 }
                        }
                    ]
                }
            )
        })
    })

    test('should mark the game level as unsolved when a new game is unsolved', async () => {
        gameLevelsAdapter.getGameLevels.mockImplementation(() => {
            return {
                levels: [
                    {
                        levelNum: 3,
                        activeStars: 2,
                        state: LEVEL_STATES.COMPLETED,
                        unsolved: false
                    },
                ],
                starsEarned: 3
            }
        })

        gameLevelsAdapter.getLevelCompletedGames.mockImplementation(() => {
            return {
                levels: [
                    {
                        level: AUTO_GENERATED_NEW_GAME_IDS.EASY,
                        levelNum: 3,
                        starsEarned: 3,
                        mistakes: 1,
                        time: { hours: 0, minutes: 0, seconds: 45 },
                        hintsUsed: 2
                    },
                ],
                unsolvedLevels: [],
                totalStarsEarned: 3,
                bestTime: { hours: 0, minutes: 0, seconds: 0 }
            }
        })

        await renderScreenAndWaitForPuzzleStart()

        await gameOverByMistakes()

        await waitFor(() => {
            expect(gameLevelsAdapter.saveLevelCompletedGames).toHaveBeenCalledWith(
                AUTO_GENERATED_NEW_GAME_IDS.EASY,
                {
                    bestTime: { hours: 0, minutes: 0, seconds: 0 },
                    totalStarsEarned: 3,
                    unsolvedLevels: [1],
                    levels: [
                        {
                            level: AUTO_GENERATED_NEW_GAME_IDS.EASY,
                            levelNum: 3,
                            starsEarned: 3,
                            mistakes: 1,
                            time: { hours: 0, minutes: 0, seconds: 45 },
                            hintsUsed: 2
                        }
                    ]
                }
            )
        })
    })

    test('should not update any info about a a solved game when it is started again and is unsolved', async () => {
        gameLevelsAdapter.getGameLevels.mockImplementation(() => {
            return {
                levels: [
                    {
                        levelNum: 1,
                        activeStars: 3,
                        state: LEVEL_STATES.COMPLETED,
                        unsolved: false
                    },
                ],
                starsEarned: 3
            }
        })

        gameLevelsAdapter.getLevelCompletedGames.mockImplementation(() => {
            return {
                levels: [
                    {
                        level: AUTO_GENERATED_NEW_GAME_IDS.EASY,
                        levelNum: 1,
                        starsEarned: 3,
                        mistakes: 1,
                        time: { hours: 0, minutes: 0, seconds: 45 },
                        hintsUsed: 2
                    },
                ],
                unsolvedLevels: [],
                totalStarsEarned: 3,
                bestTime: { hours: 0, minutes: 0, seconds: 0 }
            }
        })

        await renderScreenAndWaitForPuzzleStart()

        await gameOverByMistakes()

        expect(gameLevelsAdapter.saveLevelCompletedGames).not.toHaveBeenCalled()
    })

    test('should update the stars earned for a solved puzzle when it is solved again and number of earned stars increases', async () => {
        gameLevelsAdapter.getGameLevels.mockImplementation(() => {
            return {
                levels: [
                    {
                        levelNum: 1,
                        activeStars: 1,
                        state: LEVEL_STATES.COMPLETED,
                        unsolved: false
                    },
                ],
                starsEarned: 1
            }
        })

        gameLevelsAdapter.getLevelCompletedGames.mockImplementation(() => {
            return {
                levels: [
                    {
                        level: AUTO_GENERATED_NEW_GAME_IDS.EASY,
                        levelNum: 1,
                        starsEarned: 1,
                        mistakes: 1,
                        time: { hours: 0, minutes: 0, seconds: 45 },
                        hintsUsed: 2
                    },
                ],
                unsolvedLevels: [],
                totalStarsEarned: 1,
                bestTime: { hours: 0, minutes: 0, seconds: 0 }
            }
        })

        await renderScreenAndWaitForPuzzleStart()

        solvePuzzle()

        await waitFor(() => {
            expect(gameLevelsAdapter.saveLevelCompletedGames).toHaveBeenCalledWith(
                AUTO_GENERATED_NEW_GAME_IDS.EASY,
                {
                    bestTime: { hours: 0, minutes: 0, seconds: 0 },
                    totalStarsEarned: 3,
                    unsolvedLevels: [],
                    levels: [
                        {
                            level: AUTO_GENERATED_NEW_GAME_IDS.EASY,
                            levelNum: 1,
                            starsEarned: 3,
                            mistakes: 0,
                            time: { hours: 0, minutes: 0, seconds: 0 },
                            hintsUsed: 0
                        }
                    ]
                }
            )
        })
    })

    test('should update the stars earned for a solved puzzle when it is solved again and number of earned stars decreases', async () => {
        gameLevelsAdapter.getGameLevels.mockImplementation(() => {
            return {
                levels: [
                    {
                        levelNum: 1,
                        activeStars: 3,
                        state: LEVEL_STATES.COMPLETED,
                        unsolved: false
                    },
                ],
                starsEarned: 3
            }
        })

        gameLevelsAdapter.getLevelCompletedGames.mockImplementation(() => {
            return {
                levels: [
                    {
                        level: AUTO_GENERATED_NEW_GAME_IDS.EASY,
                        levelNum: 1,
                        starsEarned: 3,
                        mistakes: 1,
                        time: { hours: 0, minutes: 0, seconds: 45 },
                        hintsUsed: 0
                    },
                ],
                unsolvedLevels: [],
                totalStarsEarned: 3,
                bestTime: { hours: 0, minutes: 0, seconds: 0 }
            }
        })

        await renderScreenAndWaitForPuzzleStart()

        act(() => {
            jest.advanceTimersByTime(3000000)
        })

        solvePuzzle()

        await waitFor(() => {
            expect(gameLevelsAdapter.saveLevelCompletedGames).toHaveBeenCalledWith(
                AUTO_GENERATED_NEW_GAME_IDS.EASY,
                {
                    bestTime: { hours: 0, minutes: 0, seconds: 0 },
                    totalStarsEarned: 1,
                    unsolvedLevels: [],
                    levels: [
                        {
                            level: AUTO_GENERATED_NEW_GAME_IDS.EASY,
                            levelNum: 1,
                            starsEarned: 1,
                            mistakes: 0,
                            time: { hours: 0, minutes: 50, seconds: 0 },
                            hintsUsed: 0
                        }
                    ]
                }
            )
        })
    })
})
