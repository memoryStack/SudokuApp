import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

import { fonts } from '@resources/fonts/font'

export const getStyles = (_, theme) => StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        paddingTop: 16,
        paddingBottom: 32,
        paddingHorizontal: '3%', // 94% is te grid size
    },
    closeIconContainer: {
        alignSelf: 'flex-end',
        marginBottom: 16,
    },
    closeIcon: {
        color: _get(theme, ['colors', 'on-surface-variant']),
    },
    inputPanelContainer: {
        width: '100%',
        marginVertical: 24,
    },
    playButtonContainer: {
        paddingHorizontal: 24,
        width: '80%',
    },
    snackBarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        padding: 16,
        marginHorizontal: 24,
        backgroundColor: 'rgba(0, 0, 0, .9)', // replace this after talking to designer
        position: 'absolute',
        bottom: 150,
        alignSelf: 'center',
    },
    snackBarText: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        fontFamily: fonts.regular,
    },
    // TODO: use it from tokens
    selectedCellBGColor: {
        backgroundColor: 'rgb(255, 245, 187)',
    },
    sameHouseSameValueBGColor: {
        backgroundColor: _get(theme, ['colors', 'error-container']),
    },
    wronglyFilledNumColor: {
        color: _get(theme, ['colors', 'error']),
    },
    clueNumColor: {
        color: 'rgb(12, 25, 22)',
    },
})
