export const toOrdinal = num => {
    const remainderWithTen = num % 10
    const remainderWithHundred = num % 100

    if (remainderWithTen == 1 && remainderWithHundred != 11) {
        return num + 'st'
    }
    if (remainderWithTen == 2 && remainderWithHundred != 12) {
        return num + 'nd'
    }
    if (remainderWithTen == 3 && remainderWithHundred != 13) {
        return num + 'rd'
    }
    return num + 'th'
}
