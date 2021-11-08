import { StyleSheet } from 'react-native'
import { GAME_BOARD_HEIGHT, GAME_BOARD_WIDTH, CELL_HEIGHT, OUTER_THIN_BORDER_WIDTH } from './dimensions'

export const Styles = StyleSheet.create({
    board: {
        // figure out a way  for the shadow of this board
        display: 'flex',
        height: GAME_BOARD_HEIGHT,
        width: GAME_BOARD_WIDTH,
        marginHorizontal: 'auto',
    },
    gridBorderContainer: {
        position: 'absolute',
        height: GAME_BOARD_HEIGHT,
        width: GAME_BOARD_WIDTH,
        justifyContent: 'space-between',
        zIndex: 1,
    },
    verticalBars: {
        height: GAME_BOARD_HEIGHT,
        width: 1,
        backgroundColor: 'rgba(0, 0, 0, .9)',
    },
    horizontalBars: {
        width: GAME_BOARD_WIDTH,
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, .9)',
    },
    rowStyle: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        width: '100%',
    },
    cellContainer: {
        flex: 1,
        height: '100%',
    },
    thickBorder: {
        backgroundColor: 'black',
    },
    selectedCellBGColor: {
        backgroundColor: 'rgb(255, 245, 187)',
    },
    sameHouseSameValueBGColor: {
        backgroundColor: 'rgb(245, 198, 210)',
    },
    sameHouseCellBGColor: {
        backgroundColor: '#d5e5f6',
    },
    diffHouseSameValueBGColor: {
        backgroundColor: 'rgb(172, 225, 248)',
    },
    wronglyFilledNumColor: {
        color: 'rgb(167, 51, 37)',
    },
    userFilledNumColor: {
        color: 'rgb(49, 90, 163)',
    },
    clueNumColor: {
        color: 'rgb(12, 25, 22)',
    },
})
