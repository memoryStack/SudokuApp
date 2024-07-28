

import { NEW_GAME_IDS } from '@application/usecases/newGameMenu/constants'
import { MENU_ITEMS_LABELS as NEW_GAME_MENU_ITEMS_LABELS } from '../nextGameMenu/nextGameMenu.constants'

export const DEFAULT_STATE = {
    maxMistakesLimit: 3,
    mistakes: 0,
    difficultyLevel: '',
    time: { hours: 0, minutes: 0, seconds: 0 },
}

export const MISTAKES_TEXT_TEST_ID = 'MISTAKES_TEXT_TEST_ID'

export const PUZZLE_LEVEL_TEXT_TEST_ID = 'PUZZLE_LEVEL_TEXT_TEST_ID'

export const PUZZLE_LEVEL_TEXT = {
    ...NEW_GAME_MENU_ITEMS_LABELS,
    [NEW_GAME_IDS.SHARED_PUZZLE]: 'Shared Puzzle'
}
