import React from 'react'

import { Text as RNText } from 'react-native'

import PropTypes from 'prop-types'

import _get from '@lodash/get'
import _isArray from '@lodash/isArray'

import { FONT_WEIGHT_VS_FONT_FAMILY, DEFAULT_FONT_WEIGHT, fonts } from 'src/resources/fonts/font'

const getStylesObjectFromProps = styleProp => {
    if (_isArray(styleProp)) return Object.assign({}, ...styleProp)
    return styleProp
}

const Text = ({
    style,
    ...rest
}) => {
    const styles = getStylesObjectFromProps(style)
    const fontWeight = _get(styles, 'fontWeight', DEFAULT_FONT_WEIGHT)
    const stylesWithFont = {
        ...styles,
        fontFamily: fonts[FONT_WEIGHT_VS_FONT_FAMILY[fontWeight]],
        fontWeight,
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
    style: PropTypes.object,
}

Text.defaultProps = {
    style: {},
}
