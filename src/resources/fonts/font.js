import { Platform } from 'react-native'

// TODO: it's better to use only regular fontFamily
// and handle bold and italics effects using text props
// like textTransform, fontStyle only
// TODO: do some research on this

export const fonts = Platform.select({
    android: {
        regular: 'ProximaNovaRegular',
        bold: 'ProximaNovaBold',
        italics: 'ProximaNovaItalic',
    },
    ios: {
        regular: 'ProximaNova-Regular',
        bold: 'ProximaNova-Bold',
        italics: 'ProximaNova-RegularIt',
    },
})
