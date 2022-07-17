export const toOrdinal = num => {

    if (!isValidValueForConversion(num)) {
        return 'NaNth'
        // learn how to throw errors and handle them properly
        // throw new Error('invalid value for conversion to ordinal form')
    }

    const remainderWithTen = num % 10
    const remainderWithHundred = num % 100

    if (remainderWithTen === 1 && remainderWithHundred !== 11) {
        return num + 'st'
    }
    if (remainderWithTen === 2 && remainderWithHundred !== 12) {
        return num + 'nd'
    }
    if (remainderWithTen === 3 && remainderWithHundred !== 13) {
        return num + 'rd'
    }
    return num + 'th'
}

const isValidValueForConversion = (value) => {
    if (value === null) return false
    return !isNaN(value)
}