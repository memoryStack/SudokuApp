import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

import { FONT_WEIGHTS } from '@resources/fonts/font'

import smartHintColorSystemReader from '../utils/smartHints/colorSystem.reader'

const FOOTER_HEIGHT = 24

export const getStyles = ({ windowHeight }, theme) => StyleSheet.create({
    containerStyles: {
        width: '100%',
        padding: 16,
        paddingBottom: 8,
        height: windowHeight / 4 + FOOTER_HEIGHT,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    hintTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hintTitle: {
        fontWeight: FONT_WEIGHTS.MEDIUM,
    },
    bodyContainer: {
        flex: 1,
        width: '100%',
    },
    hintLogicText: {
        lineHeight: 20,
    },
    hintsCountText: { marginLeft: 8, fontSize: 20 },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: FOOTER_HEIGHT,
        width: '100%',
        marginTop: 8,
    },
    footerButtonText: { color: '#4088da' },
    tryOutResult: {
        marginTop: 8,
        marginBottom: 4,
        lineHeight: 18,
    },
    tryOutDefaultResult: {
        color: 'black',
    },
    tryOutErrorResult: {
        color: smartHintColorSystemReader.incorrectTryOutInputMsgColor(_get(theme, 'colors.smartHints')),
    },
    tryOutProgressResult: {
        color: smartHintColorSystemReader.correctTryOutInputMsgColor(_get(theme, 'colors.smartHints')),
    },
    snackBar: {
        bottom: 200,
    },
})
