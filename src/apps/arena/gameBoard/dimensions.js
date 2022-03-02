import { Dimensions } from 'react-native'

const getGameBoardWidth = () => {
    const { width: windowWidth } = Dimensions.get('window')
    let result = Math.floor(windowWidth * 0.94)
    const extraPixels = (result - (2 * 3 + 2 * 1)) % 9
    result -= extraPixels
    return result
}

/* board and cell dimensions */
export const GAME_BOARD_WIDTH = getGameBoardWidth(),
    GAME_BOARD_HEIGHT = GAME_BOARD_WIDTH,
    INNER_THICK_BORDER_WIDTH = 3,
    OUTER_THIN_BORDER_WIDTH = 1,
    CELL_BORDER_WIDTH = 1,
    CELL_WIDTH = (GAME_BOARD_WIDTH - (2 * INNER_THICK_BORDER_WIDTH + 2 * OUTER_THIN_BORDER_WIDTH)) / 9,
    CELL_HEIGHT = CELL_WIDTH
