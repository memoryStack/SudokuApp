import React from 'react'

import { Text as RNText } from 'react-native'

import PropTypes from 'prop-types'

import _get from '@lodash/get'
import _isArray from '@lodash/isArray'

import {
    FONT_WEIGHT_VS_FONT_FAMILY, fonts, FONT_WEIGHTS,
} from '@resources/fonts/font'

import { useThemeValues } from '../../../apps/arena/hooks/useTheme'

import { TEXT_VARIATIONS, TEXT_VARIATION_VS_TOKENS_PATH } from './text.constants'

const getFinalStyles = (styleProp, type, withoutLineHeight, theme) => {
    const styleFromProps = _isArray(styleProp) ? Object.assign({}, ...styleProp) : styleProp

    const result = {
        ..._get(theme, TEXT_VARIATION_VS_TOKENS_PATH[type], {}),
        ...styleFromProps,
    }

    if (withoutLineHeight) delete result.lineHeight

    return result
}

const Text = ({
    style,
    type,
    withoutLineHeight,
    ...rest
}) => {
    const theme = useThemeValues()

    const styles = getFinalStyles(style, type, withoutLineHeight, theme)
    const fontWeight = _get(styles, 'fontWeight', FONT_WEIGHTS.REGULAR)
    const stylesWithFont = {
        ...styles,
        fontFamily: fonts[FONT_WEIGHT_VS_FONT_FAMILY[fontWeight]],
        fontWeight,
        includeFontPadding: false,
        textAlignVertical: 'center',
    }

    return (
        <RNText
            style={stylesWithFont}
            {...rest}
        />
    )
}

export default React.memo(Text)

Text.propTypes = {
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
    type: PropTypes.oneOf(Object.keys(TEXT_VARIATIONS)),
    withoutLineHeight: PropTypes.bool,
}

Text.defaultProps = {
    style: {},
    type: TEXT_VARIATIONS.BODY_LARGE,
    withoutLineHeight: false,
}
