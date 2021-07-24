import { StyleSheet } from 'react-native'
import { GAME_BOARD_HEIGHT, GAME_BOARD_WIDTH, CELL_HEIGHT, OUTER_THIN_BORDER_WIDTH } from './dimensions'

export const Styles = StyleSheet.create({
    board: { // figure out a way  for the shadow of this board
        display: 'flex',
        height: GAME_BOARD_HEIGHT,
        width: '94%',
        marginHorizontal: 'auto',
        borderWidth: OUTER_THIN_BORDER_WIDTH,
        borderColor: 'rgba(0, 0, 0, 0.8)',
        backgroundColor: 'black', // this color will be same as the color of the thick seperators
    },
    rowStyle: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        // justifyContent: 'space-evenly',
        // alignSelf: 'center',
        
        // height: CELL_HEIGHT,
        // width: GAME_BOARD_WIDTH - 2,
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
    }
})
