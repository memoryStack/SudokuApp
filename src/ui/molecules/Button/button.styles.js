import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

import { hexToRGBA } from '@utils/util'
import { BUTTON_TYPES } from './button.constants'

// Note: can't use opacity property here because it will dim down text as well
//      looks like opacity dim downs whole container's contents along with container
//      so work-around is to use rgba() function for showing disabled states

const getStyles = ({
    type, state, isIconAvailable, isLabelAvailable,
}, theme) => {
    const buttonConfigs = {
        type, state, isIconAvailable, isLabelAvailable,
    }

    return StyleSheet.create({
        defaultContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: getContainerBackgroundColor(buttonConfigs, theme),
            height: _get(theme, ['button', type, 'layout', 'container', 'height']),
            borderRadius: _get(theme, ['button', type, 'layout', 'container', 'border-radius']),
            ...getContainerPaddings(buttonConfigs, theme),
            ...getContainerOutlineStyles(buttonConfigs, theme),
        },
        labelDefaultColor: {
            color: getTextColor(buttonConfigs, theme),
        },
        labelDefaultFont: {
            ..._get(theme, ['button', type, 'layout', 'label-text', 'font']),
        },
        icon: { // TODO: how these properties will work with Svg icons. test that
            color: getIconColor(buttonConfigs, theme),
            width: _get(theme, ['button', type, 'layout', 'icon', 'size']),
            height: _get(theme, ['button', type, 'layout', 'icon', 'size']),
        },
    })
}

export const getContainerBackgroundColor = ({ type, state }, theme) => {
    const { background = 'transparent', opacity } = _get(theme, ['button', type, 'color', 'container', state], {})
    return hexToRGBA(background, opacity)
}

const getContainerPaddings = ({
    type, isIconAvailable, isLabelAvailable,
}, theme) => {
    // TODO: what will happen if only icon is available ??
    //      it will need some refactoring
    let paddingLeft; let paddingRight
    if (isIconAvailable && isLabelAvailable) {
        paddingLeft = _get(theme, ['button', type, 'layout', 'container', 'padding', 'with-icon', 'icon-side-padding'])
        paddingRight = _get(theme, ['button', type, 'layout', 'container', 'padding', 'with-icon', 'icon-opposite-side-padding'])
    } else if (isLabelAvailable) {
        paddingLeft = _get(theme, ['button', type, 'layout', 'container', 'padding', 'without-icon', 'padding-left'])
        paddingRight = _get(theme, ['button', type, 'layout', 'container', 'padding', 'without-icon', 'padding-right'])
    }
    return { paddingLeft, paddingRight }
}

const getContainerOutlineStyles = ({ type, state }, theme) => {
    if (type !== BUTTON_TYPES.OUTLINED) return {}

    return {
        borderWidth: _get(theme, ['button', type, 'layout', 'container', 'border-width']),
        borderColor: _get(theme, ['button', type, 'color', 'outline', state, 'color']),
    }
}

export const getTextColor = ({ type, state }, theme) => {
    const { color, opacity } = _get(theme, ['button', type, 'color', 'label-text', state], {})
    return hexToRGBA(color, opacity)
}

const getIconColor = ({ type, state }, theme) => {
    const { color, opacity } = _get(theme, ['button', type, 'color', 'icon', state], {})
    return hexToRGBA(color, opacity)
}

export { getStyles }
