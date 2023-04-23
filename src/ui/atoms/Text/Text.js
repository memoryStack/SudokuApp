import React from 'react'

import { Text as RNText } from 'react-native'

import { fonts } from 'src/resources/fonts/font'

const Text = ({
    style: styleProps,
    ...rest
}) => (
    <RNText style={[styleProps, { fontFamily: fonts.regular }]} {...rest} />
)

export default React.memo(Text)
