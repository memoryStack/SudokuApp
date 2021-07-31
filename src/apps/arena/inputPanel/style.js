import { StyleSheet } from 'react-native'
import { INPUT_PANEL_HEIGHT, INPUT_NUMBER_CONTAINER_MAX_WIDTH } from '../../arena/gameBoard/dimensions'

export const INPUT_NUMBER_DEFAULT_HEIGHT = INPUT_PANEL_HEIGHT * .8
export const INPUT_NUMBER_DEFAULT_WIDTH = INPUT_NUMBER_CONTAINER_MAX_WIDTH * .7
// TODO: make the layout flexible and test this on various devices
export const Styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        height: INPUT_PANEL_HEIGHT,
    },
    numberButtonContainer: { // rectangular outer container for Input Number
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: INPUT_NUMBER_CONTAINER_MAX_WIDTH, // 9 numbers in the row
        // height: 50,
        height: '100%',
    },
    numberContainer: { // TODO: put shadow support for the button
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: INPUT_NUMBER_DEFAULT_HEIGHT,
        width: Math.min(INPUT_NUMBER_DEFAULT_HEIGHT * .7, INPUT_NUMBER_DEFAULT_WIDTH),
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, .1)',
        borderRadius: 100,
    },
    textStyle: {
        color: 'rgb(49, 90, 163)',
        fontSize: 28,
        textAlign: 'center',
    },
})
