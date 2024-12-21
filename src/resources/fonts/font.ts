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

export const FONT_FAMILIES = {
    CUSTOM: 'custom',
    REGULAR: 'regular',
    MEDIUM: 'medium',
    SEMI_BOLD: 'semibold',
    BOLD: 'bold',
    EXTRA_BOLD: 'extra_bold',
    HEAVY: 'heavy',
    WITHOUT_ASCENDER_DESCENDER: 'no_ascender_descender'
}

export enum FONT_WEIGHTS {
    CUSTOM = '200',
    REGULAR = '400',
    MEDIUM = '500',
    SEMI_BOLD = '600',
    BOLD = '700',
    EXTRA_BOLD = '800',
    HEAVY = '900',
}

// NOTE: semi-bold doesn't exist for Roboto font
export const FONT_WEIGHT_VS_FONT_FAMILY = {
    [FONT_WEIGHTS.CUSTOM]: FONT_FAMILIES.CUSTOM,
    [FONT_WEIGHTS.REGULAR]: FONT_FAMILIES.REGULAR,
    [FONT_WEIGHTS.MEDIUM]: FONT_FAMILIES.MEDIUM,
    // [FONT_WEIGHTS.SEMI_BOLD]: FONT_FAMILIES.SEMI_BOLD,
    [FONT_WEIGHTS.BOLD]: FONT_FAMILIES.BOLD,
    [FONT_WEIGHTS.EXTRA_BOLD]: FONT_FAMILIES.EXTRA_BOLD,
    [FONT_WEIGHTS.HEAVY]: FONT_FAMILIES.HEAVY,
}

export const fonts = Platform.select({
    android: {
        [FONT_FAMILIES.CUSTOM]: 'Roboto',
        [FONT_FAMILIES.REGULAR]: 'Roboto',
        [FONT_FAMILIES.MEDIUM]: 'Roboto',
        // [FONT_FAMILIES.SEMI_BOLD]: 'Roboto',
        [FONT_FAMILIES.BOLD]: 'Roboto',
        [FONT_FAMILIES.EXTRA_BOLD]: 'Roboto',
        [FONT_FAMILIES.HEAVY]: 'Roboto',
        [FONT_FAMILIES.WITHOUT_ASCENDER_DESCENDER]: 'Roboto-No-Ascender-Descender',
    },
    ios: {
        // TODO: test for iOS
        [FONT_FAMILIES.REGULAR]: 'OpenSans',
        [FONT_FAMILIES.MEDIUM]: 'OpenSans-Medium',
        // [FONT_FAMILIES.SEMI_BOLD]: 'OpenSans-Semibold',
        [FONT_FAMILIES.BOLD]: 'OpenSans-Bold',
    },
})
