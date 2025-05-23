import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

import { TEXT_VARIATIONS, TEXT_VARIATION_VS_TOKENS_PATH } from '@ui/atoms/Text/text.constants'

export const getStyles = (_, theme) => StyleSheet.create({
    stepNumber: {
        containerStyles: {
            backgroundColor: _get(theme, ['colors', 'primary']),
        },
        textStyles: {
            ..._get(theme, TEXT_VARIATION_VS_TOKENS_PATH[TEXT_VARIATIONS.TITLE_SMALL], {}),
        }
    },
    tooltip: {
        container: {
            paddingBottom: 16
        },
        skipText: {
            color: _get(theme, ['colors', 'primary']),
            ..._get(theme, TEXT_VARIATION_VS_TOKENS_PATH[TEXT_VARIATIONS.TITLE_SMALL], {}),
        },
        previousText: {
            color: _get(theme, ['colors', 'primary']),
            ..._get(theme, TEXT_VARIATION_VS_TOKENS_PATH[TEXT_VARIATIONS.TITLE_SMALL], {}),
        },
        nextText: {
            color: _get(theme, ['colors', 'primary']),
            ..._get(theme, TEXT_VARIATION_VS_TOKENS_PATH[TEXT_VARIATIONS.TITLE_SMALL], {}),
        },
        finishText: {
            color: _get(theme, ['colors', 'primary']),
            ..._get(theme, TEXT_VARIATION_VS_TOKENS_PATH[TEXT_VARIATIONS.TITLE_SMALL], {}),
        },
    }
})
