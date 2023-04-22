import { PixelRatio, StyleSheet } from 'react-native'

import { fonts } from 'src/resources/fonts/font'

import _get from '@lodash/get'
import _isNil from '@lodash/isNil'

import { isHexColor, rgba } from '@utils/util'

// Note: can't use opacity property here because it will dim down text as well
//      looks like opacity dim downs whole container's contents along with container
//      so work-around is to use rgba() function for showing disabled states

const getStyles = ({
    type, state, isIconAvailable, isTextAvailable,
}, theme) => {
    const buttonConfigs = {
        type, state, isIconAvailable, isTextAvailable,
    }

    return StyleSheet.create({
        defaultContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: getContainerBackgroundColor({ type, state }, theme),
            height: _get(theme, ['button', type, 'layout', 'container', 'height']),
            borderRadius: _get(theme, ['button', type, 'layout', 'container', 'border-radius']),
            ...getContainerPaddings(buttonConfigs, theme),
        },
        defaultText: {
            // TODO: what should be the font-weight for each type of button
            //      current font-weight is small
            color: getTextColor(buttonConfigs, theme),
            fontFamily: fonts.regular,
            // fontSize: _get(theme, ['button', type, 'layout', 'label-text', 'size']),
            // lineHeight: _get(theme, ['button', type, 'layout', 'label-text', 'line-height']),

            // fontWeight: '600',

            fontSize: 24,
            lineHeight: 40,
            fontWeight: '500', // 700 goes in bold category
            // letterSpacing: 0.3,

        },
        icon: { // TODO: how these properties will work with Svg icons. test that
            color: getIconColor(buttonConfigs, theme),
            width: _get(theme, ['button', type, 'layout', 'icon', 'size']),
            height: _get(theme, ['button', type, 'layout', 'icon', 'size']),
        },
    })
}

const getContainerBackgroundColor = ({ type, state }, theme) => {
    const { background = 'transparent', opacity } = _get(theme, ['button', type, 'color', 'container', state])
    return getTransformedHexColor({ color: background, opacity })
}

const getContainerPaddings = ({
    type, isIconAvailable, isTextAvailable,
}, theme) => {
    // TODO: what will happen if only icon is available ??
    //      it will need some refactoring
    let paddingLeft; let paddingRight
    if (isIconAvailable && isTextAvailable) {
        paddingLeft = _get(theme, ['button', type, 'layout', 'container', 'padding', 'with-icon', 'icon-side-padding'])
        paddingRight = _get(theme, ['button', type, 'layout', 'container', 'padding', 'with-icon', 'icon-opposite-side-padding'])
    } else if (isTextAvailable) {
        paddingLeft = _get(theme, ['button', type, 'layout', 'container', 'padding', 'without-icon', 'padding-left'])
        paddingRight = _get(theme, ['button', type, 'layout', 'container', 'padding', 'without-icon', 'padding-right'])
    }
    return { paddingLeft, paddingRight }
}

const getTextColor = ({ type, state }, theme) => {
    const { color, opacity } = _get(theme, ['button', type, 'color', 'label-text', state])
    return getTransformedHexColor({ color, opacity })
}

const getIconColor = ({ type, state }, theme) => {
    const { color, opacity } = _get(theme, ['button', type, 'color', 'icon', state])
    return getTransformedHexColor({ color, opacity })
}

const getTransformedHexColor = ({ color, opacity }) => {
    if (!isHexColor(color)) return color
    return rgba(color, opacity)
}

export { getStyles }
