import { Dimensions } from 'react-native'
import { CARD_DIMENSIONS } from '@ui/atoms/LevelCard'
import { START_GAME_MENU_ITEMS_IDS } from '@application/usecases/newGameMenu/constants'

const SCREEN_WIDTH = Dimensions.get('window').width
export const NUM_COLUMNS = 3
export const PAGE_PADDINGS = 16 // IT SHOULD COME FROM A CENTRAL PLACE
export const ITEM_WIDTH = CARD_DIMENSIONS.WIDTH
export const ITEM_HEIGHT = CARD_DIMENSIONS.HEIGHT
export const ROWS_GAP = 24
export const itemHorizontalMargin = ((SCREEN_WIDTH - 2 * PAGE_PADDINGS) / NUM_COLUMNS - ITEM_WIDTH) / 2

export const GAME_LEVELS_TEXT = {
    [START_GAME_MENU_ITEMS_IDS.EASY]: 'Easy',
    [START_GAME_MENU_ITEMS_IDS.MEDIUM]: 'Medium',
    [START_GAME_MENU_ITEMS_IDS.HARD]: 'Hard',
    [START_GAME_MENU_ITEMS_IDS.EXPERT]: 'Expert',
}
