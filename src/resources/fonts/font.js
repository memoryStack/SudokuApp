import { Platform } from 'react-native'

/*
    How fonts are working
        Issues which i faced
            1. fontWeights like 300, 400 were not working before on android.
                on iOS it is supposed to work fine, haven't tested it though
        Solution
            Added custom fonts for android in native side for each fontWeights
            Note: "italic" style works fine using {fontStyle: "italic"}, so didn't
                add italic version of fonts to reduce bundle size

        TODO: test this custom-fonts on android API level <= 28. I mildly remember
                that this costom-fonts is only available for API >= 28
*/

const FONT_FAMILIES = {
    REGULAR: 'regular',
    MEDIUM: 'medium',
    SEMI_BOLD: 'semibold',
    BOLD: 'bold',
}

export const DEFAULT_FONT_WEIGHT = '400'

// NOTE: semi-bold doesn't exist for Roboto font
export const FONT_WEIGHT_VS_FONT_FAMILY = {
    400: FONT_FAMILIES.REGULAR,
    500: FONT_FAMILIES.MEDIUM,
    // 600: FONT_FAMILIES.SEMI_BOLD,
    700: FONT_FAMILIES.BOLD,
}

export const fonts = Platform.select({
    android: {
        [FONT_FAMILIES.REGULAR]: 'Roboto',
        [FONT_FAMILIES.MEDIUM]: 'Roboto',
        // [FONT_FAMILIES.SEMI_BOLD]: 'Roboto',
        [FONT_FAMILIES.BOLD]: 'Roboto',
    },
    ios: {
        // TODO: test for iOS
        [FONT_FAMILIES.REGULAR]: 'OpenSans',
        [FONT_FAMILIES.MEDIUM]: 'OpenSans-Medium',
        // [FONT_FAMILIES.SEMI_BOLD]: 'OpenSans-Semibold',
        [FONT_FAMILIES.BOLD]: 'OpenSans-Bold',
    },
})
