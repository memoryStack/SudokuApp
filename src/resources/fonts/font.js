
import { Platform } from 'react-native'

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
