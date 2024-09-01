import { Dimensions } from 'react-native'
import { CARD_DIMENSIONS } from '@ui/atoms/LevelCard'

const SCREEN_WIDTH = Dimensions.get('window').width
const NUM_COLUMNS = 3
export const PAGE_PADDINGS = 16 // IT SHOULD COME FROM A CENTRAL PLACE
export const ITEM_WIDTH = CARD_DIMENSIONS.WIDTH
export const ITEM_HEIGHT = CARD_DIMENSIONS.HEIGHT
export const ROWS_GAP = 24
export const itemHorizontalMargin = ((SCREEN_WIDTH - 2 * PAGE_PADDINGS) / NUM_COLUMNS - ITEM_WIDTH) / 2
