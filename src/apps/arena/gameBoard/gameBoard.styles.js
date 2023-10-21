import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

import { HC_OVERLAY_BG_COLOR } from '../../components/BottomDragger'

import { STATIC_BOARD_ELEMENTS_DIMENSIONS } from '../constants'
import smartHintColorSystemReader from '../utils/smartHints/colorSystem.reader'

// TODO: think of a better color scheme mechanism
const COLOR_SCHEME_STYLES = theme => ({
    thickBorder: {
        backgroundColor: 'black',
    },
    selectedCellBGColor: {
        backgroundColor: 'rgb(255, 245, 187)',
    },
    // TODO: change it's naming and differentiate between custom puzzle and on going game
    sameHouseSameValueBGColor: {
        backgroundColor: _get(theme, ['colors', 'error-container']),
    },
    sameHouseCellBGColor: {
        backgroundColor: _get(theme, ['colors', 'surface-container-high']),
    },
    diffHouseSameValueBGColor: {
        backgroundColor: _get(theme, ['colors', 'primary-container']),
    },
    smartHintOutOfFocusBGColor: {
        backgroundColor: HC_OVERLAY_BG_COLOR,
    },
    defaultCellBGColor: {
        backgroundColor: 'white',
    },
    wronglyFilledNumColor: {
        color: _get(theme, ['colors', 'on-error-container']),
    },
    customPuzzleWronglyFilledNumColor: {
        color: _get(theme, ['colors', 'error']),
    },
    userFilledNumColor: {
        color: _get(theme, ['colors', 'primary']),
    },
    clueNumColor: {
        color: 'rgb(12, 25, 22)',
    },
})

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
        backgroundColor: 'rgba(0, 0, 0, .8)',
    },
    horizontalBars: {
        width: '100%',
        height: STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH,
        backgroundColor: 'rgba(0, 0, 0, .8)',
    },
    lightGridBorder: {
        backgroundColor: _get(theme, ['colors', 'outline-variant']),
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
    ...COLOR_SCHEME_STYLES(theme),
    tryOutInputColor: {
        color: smartHintColorSystemReader.tryOutFilledNumberColor(_get(theme, 'colors.smartHints')),
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
    smartHintAxisText: {
        color: 'white',
        zIndex: 100, // TODO: make a constant with name like max_possible z_index
    },
})
