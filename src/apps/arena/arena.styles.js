import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

import { hexToRGBA } from '@utils/util'

export const getStyles = (_, theme) => {
    const { color: scrimColor, opacity: scrimOpacity } = _get(theme, ['dialog', 'scrim'])
    return StyleSheet.create({
        page: {
            display: 'flex',
        },
        contentContainer: {
            flex: 1,
            width: '100%',
            alignItems: 'center',
            marginTop: 40,
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
            backgroundColor: hexToRGBA(scrimColor, scrimOpacity),
        },
        inputPanelContainer: {
            width: '100%',
            marginVertical: 20,
        },
    })
}
