import { StyleSheet } from 'react-native'
import { HC_OVERLAY_BG_COLOR } from '../../components/BottomDragger'
import { STATIC_BOARD_ELEMENTS_DIMENSIONS } from '../constants'

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

export const getStyles = ({ BOARD_GRID_WIDTH, BOARD_GRID_HEIGHT, CELL_WIDTH }) => {
    return StyleSheet.create({
        board: {
            display: 'flex',
            height: BOARD_GRID_HEIGHT,
            width: BOARD_GRID_WIDTH,
            backgroundColor: 'white',
        },
        boardAndYAxisContainer: {
            flexDirection: 'row'
        },
        gridBorderContainer: {
            position: 'absolute',
            height: BOARD_GRID_HEIGHT,
            width: BOARD_GRID_WIDTH,
            justifyContent: 'space-between',
            zIndex: 1,
        },
        verticalBars: {
            height: BOARD_GRID_HEIGHT,
            width: STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH,
            backgroundColor: 'rgba(0, 0, 0, .8)',
        },
        horizontalBars: {
            width: BOARD_GRID_WIDTH,
            height: STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH,
            backgroundColor: 'rgba(0, 0, 0, .8)',
        },
        rowStyle: {
            display: 'flex',
            flexDirection: 'row',
            height: CELL_WIDTH,
            width: BOARD_GRID_WIDTH,
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
            width: STATIC_BOARD_ELEMENTS_DIMENSIONS.AXIS_WIDTH,
        },
        xAxis: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: BOARD_GRID_WIDTH,
            height: STATIC_BOARD_ELEMENTS_DIMENSIONS.AXIS_WIDTH,
            marginLeft: STATIC_BOARD_ELEMENTS_DIMENSIONS.AXIS_WIDTH,
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
