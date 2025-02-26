import { Dimensions, StyleSheet } from 'react-native'

import _get from '@lodash/get'

import { hexToRGBA } from '@utils/util'
import { HEADER_HORIZONTAL_MARGIN } from 'src/navigation/headerSection/headerSection.constants'

export const getStyles = (_, theme) => {
    const { color: scrimColor, opacity: scrimOpacity } = _get(theme, ['dialog', 'scrim'])
    return StyleSheet.create({
        page: {
            display: 'flex',
            // backgroundColor: 'transparent',
            // zIndex: 1
        },
        bgImg: {
            position: 'absolute',
            width: '100%',
            height: 822,
            top: 0,
            bottom: 0,
            zIndex: 0
        },
        contentContainer: {
            flex: 1,
            width: '100%',
            alignItems: 'center',
            backgroundColor: 'transparent',
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
        availableStarsContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: HEADER_HORIZONTAL_MARGIN,
        },
        availableStarsText: { marginLeft: 8 },
        levelsListContainer: {
            height: (Dimensions.get('window').height) * 0.8,
            width: Dimensions.get('window').width,
            paddingTop: 24,
            paddingHorizontal: 16
        }
    })
}
