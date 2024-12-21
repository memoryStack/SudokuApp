import React from 'react'

import { Animated } from 'react-native'

import _noop from '@lodash/noop'
import _isArray from '@lodash/isArray'

import Text, { Styles, TEXT_VARIATIONS } from '@ui/atoms/Text'

import { useAnimateView } from '../useAnimateView'
import { ANIMATABLE_PROPERTIES } from '../animationUtils'

export interface Props {
    textType?: TEXT_VARIATIONS
    withoutLineHeight?: boolean
    children: string | React.ReactNode
    testID?: string
    animated?: boolean
    value: number | string
    textStyles?: Styles
    animationsConfig: any
}

const CellNumberInput: React.FC<Props> = ({
    testID = '',
    textType,
    animated = false,
    value,
    textStyles: _textStyles,
    withoutLineHeight,
    animationsConfig
}) => {

    const {
        fontSizeAnim,
        textColorInterpolation,
        animationConfigsMerge,
    } = useAnimateView(animationsConfig)

    const textStyles = _isArray(_textStyles) ? [..._textStyles] : [_textStyles]
    if (textColorInterpolation) textStyles.push({ color: textColorInterpolation })

    // we can not animate the color and fontSize using a single Animated.View
    // so have to wrap an extra Animated.View
    return (
        <Animated.View style={{ transform: [{ scale: fontSizeAnim }] }}>
            <Text
                style={textStyles}
                testID={testID}
                type={textType}
                withoutLineHeight={withoutLineHeight}
                animated={animated || ANIMATABLE_PROPERTIES.TEXT_COLOR in animationConfigsMerge}
            >
                {value}
            </Text>
        </Animated.View>
    )
}

export default React.memo(CellNumberInput)
