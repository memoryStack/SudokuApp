import { StyleSheet } from 'react-native'
import { BOARD_AXIS_WIDTH, GRID_THIN_BORDERS_WIDTH } from '../../../utils/customHooks/useBoardElementsDimensions'
import { HC_OVERLAY_BG_COLOR } from '../../components/BottomDragger'

// TODO: think of a better color scheme mechanism
export const COLOR_SCHEME_STYLES = {
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
    smartHintOutOfFocusBGColor: {
        backgroundColor: HC_OVERLAY_BG_COLOR,
        // backgroundColor: 'rgba(0, 0, 0, .2)',
    },
    defaultCellBGColor: {
        backgroundColor: 'white',
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
    tryOutInputColor: {
        color: '#FF9900',
    },
}

export const getStyles = ({ GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT, CELL_WIDTH }) => {
    return StyleSheet.create({
        board: {
            display: 'flex',
            height: GAME_BOARD_HEIGHT,
            width: GAME_BOARD_WIDTH,
            backgroundColor: 'white',
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
            width: GRID_THIN_BORDERS_WIDTH,
            backgroundColor: 'rgba(0, 0, 0, .9)',
        },
        horizontalBars: {
            width: GAME_BOARD_WIDTH,
            height: GRID_THIN_BORDERS_WIDTH,
            backgroundColor: 'rgba(0, 0, 0, .9)',
        },
        rowStyle: {
            display: 'flex',
            flexDirection: 'row',
            height: CELL_WIDTH,
            width: GAME_BOARD_WIDTH,
            backgroundColor: 'white',
        },
        cellContainer: {
            width: CELL_WIDTH,
            height: CELL_WIDTH,
        },
        ...COLOR_SCHEME_STYLES,
        yAxis: {
            justifyContent: 'space-around',
            alignItems: 'center',
            width: BOARD_AXIS_WIDTH,
        },
        xAxis: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: GAME_BOARD_WIDTH,
            height: BOARD_AXIS_WIDTH,
            marginLeft: BOARD_AXIS_WIDTH,
        },
        axisText: {
            color: 'black',
        },
        smartHintAxisText: {
            color: 'white',
            zIndex: 100, // TODO: make a constant with name like max_possible z_index
        },
    })
}
