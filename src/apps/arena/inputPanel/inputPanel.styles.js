import { StyleSheet } from 'react-native'

export const getStyles = CELL_WIDTH => {
    const INPUT_NUMBER_DIMENSION = CELL_WIDTH * 1.5 // 1.5 times the size of the board cells
    return StyleSheet.create({
        container: {
            width: '100%',
        },
        rowContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
        },
        numberButtonContainer: {
            flex: 1,
            maxWidth: INPUT_NUMBER_DIMENSION,
            maxHeight: INPUT_NUMBER_DIMENSION,
            aspectRatio: 1,
            marginHorizontal: 2,
            borderRadius: 12,
            paddingLeft: 0,
            paddingRight: 0,
        },
        horizontalSeperator: {
            width: '100%',
            height: 4,
        },
        textStyle: {
            fontWeight: '500',
        },
        eraser: {
            width: '50%',
            height: '50%',
        },
    })
}
