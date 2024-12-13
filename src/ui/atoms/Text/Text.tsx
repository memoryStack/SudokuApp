import React from 'react'

import { Text as RNText, StyleProp, ViewStyle, Animated } from 'react-native'

import _get from '@lodash/get'
import _isArray from '@lodash/isArray'

import {
    FONT_WEIGHT_VS_FONT_FAMILY, fonts, FONT_WEIGHTS,
} from '@resources/fonts/font'

import { useThemeValues } from '../../../apps/arena/hooks/useTheme'

import { TEXT_VARIATIONS, TEXT_VARIATION_VS_TOKENS_PATH } from './text.constants'

type Style = StyleProp<ViewStyle>
type StyleArray = StyleProp<ViewStyle>[]
export type Styles = Style | StyleArray

export interface Props {
    type?: TEXT_VARIATIONS
    style?: Styles
    withoutLineHeight?: boolean
    children: string | React.ReactNode
    testID?: string
    animated?: boolean
}

const getFinalStyles = (styleProp: Styles, type: TEXT_VARIATIONS, withoutLineHeight: boolean, theme: unknown) => {
    const styleFromProps = _isArray(styleProp) ? Object.assign({}, ...styleProp as StyleArray) : styleProp

    const result = {
        ..._get(theme, TEXT_VARIATION_VS_TOKENS_PATH[type], {}),
        ...styleFromProps,
    }

    if (withoutLineHeight) delete result.lineHeight

    return result
}

const Text: React.FC<Props> = ({
    style = {},
    type = TEXT_VARIATIONS.BODY_LARGE,
    withoutLineHeight = false,
    testID = '',
    animated = false,
    ...rest
}) => {
    const theme = useThemeValues()

    const styles = getFinalStyles(style, type, withoutLineHeight, theme)
    // extract this type calculation to font.js if needs at another place
    const fontWeight: keyof typeof FONT_WEIGHT_VS_FONT_FAMILY = _get(styles, 'fontWeight', FONT_WEIGHTS.REGULAR)

    const stylesWithFont = {
        ...styles,
        fontFamily: fonts && fonts[FONT_WEIGHT_VS_FONT_FAMILY[fontWeight]],
        fontWeight,
        includeFontPadding: false,
        textAlignVertical: 'center',
    }

    const TextWrapper = animated ? Animated.Text : RNText

    return (
        <TextWrapper
            style={stylesWithFont}
            testID={testID}
            {...rest}
        />
    )
}

export default React.memo(Text)
