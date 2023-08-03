import { StyleSheet } from 'react-native'

import { fonts } from '@resources/fonts/font'

export const styles = StyleSheet.create({
    page: {
        display: 'flex',
        backgroundColor: 'white',
    },
    contentContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        paddingTop: 24,
    },
    refereeContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '94%',
        marginBottom: 4,
    },
    refereeTextStyles: {
        fontSize: 14,
        fontFamily: fonts.regular,
    },
    gameOverCardAbsoluteBG: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    gameOverAnimatedBG: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, .8)',
    },
    inputPanelContainer: {
        width: '100%',
        marginVertical: 20,
    },
    sudokuBoardContainer: {
        zIndex: 1,
    },
    headerButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 16,
        marginBottom: 40,
    },
})
