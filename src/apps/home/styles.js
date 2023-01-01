import { StyleSheet } from 'react-native'

import { rgba } from '../../utils/util'

export const getStyles = CELL_WIDTH => {
    return StyleSheet.create({
        container: {
            alignItems: 'center',
            height: '100%',
            width: '100%',
            backgroundColor: 'white',
        },
        startGameButtonContainer: {
            marginTop: '20%',
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
        sudokuTextContainer: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-around',
            marginTop: '5%',
            paddingHorizontal: 16,
        },
        sudokuLetterText: {
            width: CELL_WIDTH * 1.3,
            height: CELL_WIDTH * 1.3,
            backgroundColor: rgba('#d5e5f6', 60),
            borderRadius: 12,
            textAlign: 'center',
            textAlignVertical: 'center',
            color: 'rgb(49, 90, 163)',
            fontSize: CELL_WIDTH * 0.75,
        },
        appIcon: {
            width: 100,
            height: 100,
            marginTop: '30%',
        },
        playButtonContainer: {
            backgroundColor: rgba('#d5e5f6', 60),
            borderRadius: 8,
            paddingHorizontal: 20,
            marginTop: '20%',
        },
        playButtonText: {
            color: 'rgb(49, 90, 163)',
            fontSize: 24,
        },
    })
}
