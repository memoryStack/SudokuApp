import { StyleSheet } from 'react-native'

import get from '@lodash/get'

import { fonts } from '@resources/fonts/font'

export const getStyles = (_, theme) => StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        paddingVertical: 16,
        paddingHorizontal: '3%', // 94% is te grid size
    },
    closeIconContainer: {
        alignSelf: 'flex-end',
        marginBottom: 16,
    },
    closeIcon: {
        color: get(theme, ['colors', 'on-surface-variant']),
    },
    inputPanelContainer: {
        width: '100%',
        marginVertical: 24,
    },
    playButtonContainer: {
        paddingHorizontal: 24,
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
})
