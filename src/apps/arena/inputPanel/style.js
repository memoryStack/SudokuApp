import { StyleSheet } from 'react-native'
import { rgba } from '../../../utils/util'
import { CELL_WIDTH } from '../gameBoard/dimensions'

const INPUT_NUMBER_DIMENSION = CELL_WIDTH * 1.5 // 1.5 times the size of the board cells
const INPUT_GRID_DIMENSION = INPUT_NUMBER_DIMENSION * 3
export const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    gridBorderContainer: {
        position: 'absolute',
        height: INPUT_GRID_DIMENSION,
        width: INPUT_GRID_DIMENSION,
        justifyContent: 'space-between',
        zIndex: -1,
    },
    verticalBars: {
        height: INPUT_GRID_DIMENSION,
        width: 1,
        backgroundColor: 'rgba(0, 0, 0, .1)'
    },
    horizontalBars: {
        height: 1,
        width: INPUT_GRID_DIMENSION,
        backgroundColor: 'rgba(0, 0, 0, .1)'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    numberButtonContainer: { // rectangular outer container for Input Number
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: INPUT_NUMBER_DIMENSION,
        height: INPUT_NUMBER_DIMENSION,
        marginHorizontal: 2,
        backgroundColor: rgba('#d5e5f6', 60),
        borderRadius: 12,
    },
    horizontalSeperator: {
        width: '100%',
        height: 4,
    },
    textStyle: {
        color: 'rgb(49, 90, 163)',
        fontSize: 36,
        textAlign: 'center',
    },
})
