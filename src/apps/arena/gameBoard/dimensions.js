import { Dimensions } from 'react-native'

// TODO: figure out why in myntra dimensions are passed as props to the components with a HOC withDimensions ??
const { width: windowWidth } = Dimensions.get('window')

let a = Math.floor(windowWidth * .94)
const extraPixels = (a - (2 * 3 + 2 * 1)) % 9
a -= extraPixels



/* board and cell dimensions */
export const GAME_BOARD_WIDTH = a,
    GAME_BOARD_HEIGHT = GAME_BOARD_WIDTH,
    INNER_THICK_BORDER_WIDTH = 3,
    OUTER_THIN_BORDER_WIDTH = 1,
    CELL_BORDER_WIDTH = 1,
    CELL_WIDTH = (GAME_BOARD_WIDTH - (2 * INNER_THICK_BORDER_WIDTH + 2 * OUTER_THIN_BORDER_WIDTH)) / 9,
    CELL_HEIGHT = CELL_WIDTH

console.log('@@@@@@@@@@@@@ cellWidth', CELL_WIDTH, a)
/* cell numbers and notes fontSizes  */


/* Input Panel dimensions */
export const INPUT_PANEL_HEIGHT = 50, // check it if this needs to be configurable or not
    INPUT_NUMBER_CONTAINER_MAX_WIDTH = windowWidth / 9
