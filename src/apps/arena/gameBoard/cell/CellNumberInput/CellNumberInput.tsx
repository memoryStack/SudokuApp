import React from 'react'

import { Animated } from 'react-native'

import _noop from '@lodash/noop'
import _isArray from '@lodash/isArray'

import Text, { Styles, TEXT_VARIATIONS } from '@ui/atoms/Text'

import { useAnimateView } from '../useAnimateView'
import { ANIMATABLE_PROPERTIES } from '../animationUtils'
import { usePreviousRenderValue } from '@utils/customHooks'
import _isEmpty from '@lodash/isEmpty'

export interface Props {
    textType?: TEXT_VARIATIONS
    withoutLineHeight?: boolean
    children: string | React.ReactNode
    testID?: string
    animated?: boolean
    value: number | string
    textStyles?: Styles
    animationsConfig: any
    animateNumberInsertion: boolean
}

const useNumberInputAnimationConfig = (
    value,
    animateNumberInsertion,
    animationsConfig
) => {
    const previousValue = usePreviousRenderValue(value)
    const valueInserted = !previousValue && value

    if (valueInserted && animateNumberInsertion && _isEmpty(animationsConfig)) {
        const config = {
            [ANIMATABLE_PROPERTIES.FONT_SIZE]: {
                config: { toValue: 1, duration: 300, useNativeDriver: true },
            },
            [ANIMATABLE_PROPERTIES.OPACITY]: {
                config: { toValue: 1, duration: 300, useNativeDriver: true },
            }
        }
        const initialValues = {
            [ANIMATABLE_PROPERTIES.FONT_SIZE]: 1.8,
            [ANIMATABLE_PROPERTIES.OPACITY]: 0
        }
        return [config, initialValues]
    }

    return [animationsConfig, {}]
}

const CellNumberInput: React.FC<Props> = ({
    testID = '',
    textType,
    animated = false,
    value,
    textStyles: _textStyles,
    withoutLineHeight,
    animationsConfig: _animationsConfig,
    animateNumberInsertion = false,
}) => {

    const [animationConfig, animInitialValues] = useNumberInputAnimationConfig(value, animateNumberInsertion, _animationsConfig)

    const {
        fontSizeAnim,
        textColorInterpolation,
        opacityAnim,
        animationConfigsMerge,
    } = useAnimateView(animationConfig, animInitialValues)

    const textStyles = _isArray(_textStyles) ? [..._textStyles] : [_textStyles]
    if (textColorInterpolation) textStyles.push({ color: textColorInterpolation })

    // we can not animate the color and fontSize using a single Animated.View
    // so have to wrap an extra Animated.View
    return (
        <Animated.View style={{ transform: [{ scale: fontSizeAnim }], opacity: opacityAnim }}>
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
