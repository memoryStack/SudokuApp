import { StyleSheet } from 'react-native'
import { rgba } from '../../../utils/util'
import { CELL_WIDTH } from '../gameBoard/dimensions'
import { fonts } from '../../../resources/fonts/font'

const INPUT_NUMBER_DIMENSION = CELL_WIDTH * 1.5 // 1.5 times the size of the board cells
export const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    numberButtonContainer: {
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
        fontSize: INPUT_NUMBER_DIMENSION * 0.66, // 66% of the container size
        textAlign: 'center',
        fontFamily: fonts.regular,
    },
})
