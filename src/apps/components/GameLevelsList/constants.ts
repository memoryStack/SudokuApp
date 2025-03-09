import { Dimensions } from 'react-native'
import { CARD_DIMENSIONS } from '@ui/atoms/LevelCard'

const SCREEN_WIDTH = Dimensions.get('window').width
export const NUM_COLUMNS = 3
// IT SHOULD COME FROM A CENTRAL PLACE as it's coupled with the parent container
// allowing these dimensions in this file only bacause at both of the places, the levels
// are shown in a container which is window's width wider
export const PAGE_PADDINGS = 16
export const ITEM_WIDTH = CARD_DIMENSIONS.WIDTH
export const ITEM_HEIGHT = CARD_DIMENSIONS.HEIGHT
export const ROWS_GAP = 24
export const itemHorizontalMargin = Math.floor(((SCREEN_WIDTH - 2 * PAGE_PADDINGS) / NUM_COLUMNS - ITEM_WIDTH) / 2)
