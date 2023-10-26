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
        backgroundColor: _get(theme, ['colors', 'surface']),
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
        // for disabled items, colors are taken from button disabled tokens
        backgroundColor: hexToRGBA(_get(theme, ['colors', 'on-surface']), 12),
    },
    menuItemText: {
        color: _get(theme, ['colors', 'primary']),
    },
    disabledMenuItemText: {
        color: hexToRGBA(_get(theme, ['colors', 'on-surface']), 50),
    },
    menuRowContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    horizontalSeperator: {
        width: '101%',
        height: BORDER_THICKNESS,
        backgroundColor: hexToRGBA(_get(theme, ['colors', 'on-surface']), 50),
    },
    verticalSeperator: {
        width: BORDER_THICKNESS,
        height: '101%',
        backgroundColor: hexToRGBA(_get(theme, ['colors', 'on-surface']), 50),
    },
})
