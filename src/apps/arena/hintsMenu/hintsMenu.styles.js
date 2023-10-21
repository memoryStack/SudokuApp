import { StyleSheet } from 'react-native'

import _get from '@lodash/get'
import { hexToRGBA } from '@utils/util'

const BORDER_THICKNESS = 2
export const getStyles = (_, theme) => StyleSheet.create({
    overlayContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        position: 'absolute',
        // TODO: think over it
        backgroundColor: hexToRGBA(_get(theme, ['colors', 'inverse-surface']), 80),
    },
    container: {
        height: '50%',
        width: '75%',
        backgroundColor: 'white',
        borderRadius: 32,
        overflow: 'hidden',
    },
    menuItem: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledMenuItem: {
        backgroundColor: 'rgb(178, 178, 178)',
    },
    menuItemText: {
        color: 'rgb(49, 90, 163)',
    },
    disabledMenuItemText: {
        color: 'rgb(246, 246, 246)',
    },
    menuRowContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    horizontalSeperator: {
        width: '101%',
        height: BORDER_THICKNESS,
        backgroundColor: 'rgb(49, 90, 163)',
    },
    verticalSeperator: {
        width: BORDER_THICKNESS,
        height: '101%',
        backgroundColor: 'rgb(49, 90, 163)',
    },
})
