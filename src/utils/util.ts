import { PixelRatio } from 'react-native'

export const isHexColor = (color = '') => color.startsWith('#')

export const hexToRGBA = (hex: string, opacity = 100) => {
    if (!isHexColor(hex)) return hex

    const r = parseInt(hex.substring(1, 3), 16)
    const g = parseInt(hex.substring(3, 5), 16)
    const b = parseInt(hex.substring(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
}

export const consoleLog = (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    __DEV__ && console.log(...args)
}

export const roundToNearestPixel = (sizeInDp: number) => PixelRatio.roundToNearestPixel(sizeInDp)
