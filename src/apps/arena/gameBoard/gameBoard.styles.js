import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

import { STATIC_BOARD_ELEMENTS_DIMENSIONS } from '../constants'

export const getStyles = ({ BOARD_GRID_WIDTH, BOARD_GRID_HEIGHT, CELL_WIDTH }, theme) => StyleSheet.create({
    board: {
        display: 'flex',
        height: BOARD_GRID_HEIGHT,
        width: BOARD_GRID_WIDTH,
        backgroundColor: 'white',
        borderWidth: STATIC_BOARD_ELEMENTS_DIMENSIONS.BOARD_BORDER_WIDTH,
        borderColor: _get(theme, ['colors', 'outline']),
    },
    boardAndYAxisContainer: {
        flexDirection: 'row',
    },
    gridBorderContainer: {
        display: 'flex',
        position: 'absolute',
        height: '100%',
        width: '100%',
        justifyContent: 'space-evenly',
        zIndex: 1,
    },
    verticalBars: {
        height: '100%',
        width: STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH,
    },
    horizontalBars: {
        width: '100%',
        height: STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH,
    },
    lightGridBorder: {
        backgroundColor: _get(theme, ['colors', 'outline']),
    },
    thinGridBorder: {
        // backgroundColor: _get(theme, ['colors', 'outline-variant']),
        backgroundColor: _get(theme, ['colors', 'outline']),
    },
    rowStyle: {
        display: 'flex',
        flexDirection: 'row',
        height: CELL_WIDTH,
        width: '100%',
        backgroundColor: 'white',
    },
    cellContainer: {
        width: CELL_WIDTH,
        height: CELL_WIDTH,
    },
    defaultCellBGColor: {
        backgroundColor: 'white',
    },
    defaultMainNumberColor: {
        color: 'rgb(12, 25, 22)',
    },
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
        color: _get(theme, ['colors', 'on-surface-variant-low']),
    },
})
