import { StyleSheet } from 'react-native'

import { FONT_WEIGHTS } from '@resources/fonts/font'
import get from '@lodash/get'

export const getStyles = (_, theme, isLight) => StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: get(theme, ['colors', isLight ? 'surface' : 'surface-container-high']),
        borderRadius: 8,
        width: '70%',
    },
    textColor: {
        color: get(theme, ['colors', 'on-surface']),
    },
    congratsText: {
        marginVertical: 8,
        fontWeight: FONT_WEIGHTS.MEDIUM,
    },
    statsContainer: {
        marginTop: 20,
        width: '100%',
    },
    statContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 2,
    },
    gameUnsolvedMsg: {
        textAlign: 'center',
    },
    newGameButtonContainer: {
        marginTop: 16,
        width: '80%',
    },
    timeStatContainer: {
        flexDirection: 'row',
    },
    starsContainer: {
        marginTop: 28,
    },
    middleStar: {
        bottom: 28,
        marginHorizontal: 12
    },
    reviewSectionContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: get(theme, ['colors', 'outline-variant']),
        width: '100%',
        alignItems: 'center',
    },
    reviewDescription: {
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 20,
    },
    reviewButtonContainer: {
        width: '80%',
    },
})
