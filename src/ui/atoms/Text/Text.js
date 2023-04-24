import React from 'react'

import { Text as RNText } from 'react-native'

import PropTypes from 'prop-types'

import _get from '@lodash/get'

import { FONT_WEIGHT_VS_FONT_FAMILY, DEFAULT_FONT_WEIGHT, fonts } from 'src/resources/fonts/font'

const Text = ({
    style: styleProps,
    ...rest
}) => {
    const fontWeight = _get(styleProps, 'fontWeight', DEFAULT_FONT_WEIGHT)

    const textStyles = {
        ...styleProps,
        fontFamily: fonts[FONT_WEIGHT_VS_FONT_FAMILY[fontWeight]],
        fontWeight,
    }

    return (
        <RNText style={textStyles} {...rest} />
    )
}

export default React.memo(Text)

Text.propTypes = {
    style: PropTypes.object,
}

Text.defaultProps = {
    style: {},
}
