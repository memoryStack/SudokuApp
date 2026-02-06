import React from 'react'

import { Text as RNText, StyleProp, ViewStyle } from 'react-native'

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
}

export const getTextStyles = ({
    customStyles, type = TEXT_VARIATIONS.BODY_LARGE, withoutLineHeight = false, theme
}: {
    customStyles: Styles,
    type: TEXT_VARIATIONS,
    withoutLineHeight?: boolean,
    theme: unknown
}) => {
    const styleFromProps = _isArray(customStyles) ? Object.assign({}, ...customStyles as StyleArray) : customStyles

    let result = {
        color: _get(theme, ['colors', 'on-surface']),
        ..._get(theme, TEXT_VARIATION_VS_TOKENS_PATH[type], {}),
        ...styleFromProps,
    }

    const fontWeight: keyof typeof FONT_WEIGHT_VS_FONT_FAMILY = _get(result, 'fontWeight', FONT_WEIGHTS.REGULAR)
    result = {
        ...result,
        fontFamily: fonts && fonts[FONT_WEIGHT_VS_FONT_FAMILY[fontWeight]],
        fontWeight,
        includeFontPadding: false,
        textAlignVertical: 'center',
    }

    if (withoutLineHeight) delete result.lineHeight

    return result
}

const Text: React.FC<Props> = ({
    style = {},
    type = TEXT_VARIATIONS.BODY_LARGE,
    withoutLineHeight = false,
    testID = '',
    ...rest
}) => {
    const theme = useThemeValues()

    const styles = getTextStyles({
        customStyles: style, type, withoutLineHeight, theme
    })

    return (
        <RNText
            style={styles}
            testID={testID}
            {...rest}
        />
    )
}

export default React.memo(Text)
