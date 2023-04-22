import { PixelRatio } from 'react-native'

import _inRange from 'lodash/src/utils/inRange'
import _map from 'lodash/src/utils/map'

export const isHexColor = (color = '') => color.charAt(0) === '#'

export const rgba = function (hex, opacity = 100) {
    if (!isHexColor(hex)) return hex

    const r = parseInt(hex.substring(1, 3), 16)
    const g = parseInt(hex.substring(3, 5), 16)
    const b = parseInt(hex.substring(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
}

// prototypes to the array
if (Array.prototype.allValuesSame === undefined) {
    Array.prototype.allValuesSame = function () {
        for (let i = 1; i < this.length; i++) {
            if (this[i] !== this[0]) {
                return false
            }
        }
        return true
    }
}

// TODO: change naming
if (Array.prototype.sameArrays === undefined) {
    Array.prototype.sameArrays = function (arrayB) {
        if (this.length !== arrayB.length) return false
        for (let i = 0; i < this.length; i++) {
            if (this[i] !== arrayB[i]) {
                return false
            }
        }
        return true
    }
}

if (Array.prototype.sortNumbers === undefined) {
    Array.prototype.sortNumbers = function () {
        return this.sort((a, b) => a - b)
    }
}

// TODO: how to write test-cases for these utils ??
if (Array.prototype.atIndexes === undefined) {
    Array.prototype.atIndexes = function (indexes) {
        return _map(indexes, index => this[index])
    }
}

export const consoleLog = (...args) => {
    __DEV__ && console.log(...args)
}

// TODO: fix it as per my requirements
function noWhiteSpace(strings, ...placeholders) {
    const withSpace = strings.reduce((result, string, i) => result + placeholders[i - 1] + string)
    const withoutSpace = withSpace.replace(/$\n^\s*/gm, ' ')
    return withoutSpace
}

// TODO: make it explicit here that this is a callback to Array.filter
export const onlyUnique = (value, index, self) => self.indexOf(value) === index

export const roundToNearestPixel = sizeInDp => PixelRatio.roundToNearestPixel(sizeInDp)

export const inRange = (value, { start, end }) => _inRange(value, start, end + 1)
