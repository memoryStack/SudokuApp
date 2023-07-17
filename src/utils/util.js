import { PixelRatio } from 'react-native'

import _inRange from '@lodash/inRange'
import _unique from '@lodash/unique'
import _uniqueBy from '@lodash/uniqueBy'

export const isHexColor = (color = '') => color.charAt(0) === '#'

export const hexToRGBA = (hex, opacity = 100) => {
    if (!isHexColor(hex)) return hex

    const r = parseInt(hex.substring(1, 3), 16)
    const g = parseInt(hex.substring(3, 5), 16)
    const b = parseInt(hex.substring(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
}

const singleEntryInArray = (array = []) => array.length === 1

export const areAllLiteralValuesUnique = array => singleEntryInArray(_unique(array))

export const areUniqueValuesByProperty = (array, property) => singleEntryInArray(_uniqueBy(array, property))

export const sortNumbersArray = array => array.sort((valueA, valueB) => valueA - valueB)

export const consoleLog = (...args) => {
    // eslint-disable-next-line no-console
    __DEV__ && console.log(...args)
}

export const roundToNearestPixel = sizeInDp => PixelRatio.roundToNearestPixel(sizeInDp)

export const inRange = (value, { start, end }) => _inRange(value, start, end + 1)
