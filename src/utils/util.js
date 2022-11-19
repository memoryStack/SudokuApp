import { PixelRatio } from 'react-native'

export const rgba = function (hex, opacity) {
    hex = hex.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const result = `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
    return result
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
        return this.sort(function (a, b) {
            return a - b;
        });
    }
}

export const consoleLog = (...args) => {
    __DEV__ && console.log(...args)
}

// TODO: fix it as per my requirements
function noWhiteSpace(strings, ...placeholders) {
    let withSpace = strings.reduce((result, string, i) => result + placeholders[i - 1] + string)
    let withoutSpace = withSpace.replace(/$\n^\s*/gm, ' ')
    return withoutSpace
}

export const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index
}

export const roundToNearestPixel = sizeInDp => {
    return PixelRatio.roundToNearestPixel(sizeInDp)
}

export const inRange = (value, { start, end }) => value >= start && value <= end
