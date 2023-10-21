import { StyleSheet } from 'react-native'

import _get from '@lodash/get'
import { hexToRGBA } from '@utils/util'

export const getStyles = (_, theme) => {
    const { color: scrimColor, opacity: scrimOpacity } = _get(theme, ['dialog', 'scrim'])

    return StyleSheet.create({
        backdrop: {
            height: '100%',
            width: '100%',
            backgroundColor: hexToRGBA(scrimColor, scrimOpacity),
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
        },
        untouchanbleContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    })
}
