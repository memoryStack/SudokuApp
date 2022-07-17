import _flatten from 'lodash/flatten'

describe('_flatten', () => {

    test('returns empty array if passed value is null or undefined', () => {
        expect(_flatten(null)).toStrictEqual([])
        expect(_flatten(undefined)).toStrictEqual([])
    })

    test('returns empty array when a number is passed', () => {
        expect(_flatten(1)).toStrictEqual([])
        expect(_flatten(123)).toStrictEqual([])
    })

    test('returns empty array when a non array object is passed', () => {
        expect(_flatten({})).toStrictEqual([])
        expect(_flatten(new Map())).toStrictEqual([])
        expect(_flatten(new Set())).toStrictEqual([])
        expect(_flatten(() => { })).toStrictEqual([])
    })

    test('returns an array with string characters as its elements when string is passed', () => {
        expect(_flatten('1')).toStrictEqual(['1'])
        expect(_flatten('qwerty')).toStrictEqual(['q', 'w', 'e', 'r', 't', 'y'])
    })

    test('returns a new array with same values when simple array is sent which doesnt need to be flattened. but original and returned arrays cant be compared using == or === equality check', () => {
        const array = [1, 2, 3]
        const flattenedArray = _flatten(array)
        expect(flattenedArray).toStrictEqual(array)
        expect(flattenedArray === array).toBeFalsy()
        expect(flattenedArray == array).toBeFalsy()

        expect(_flatten([])).toStrictEqual([])
    })

    test('returns a new array after inlining the elements of sub arrays which are only one level deep', () => {
        const inputArray = [1, [2, [3, [4]], 5], [123]]
        const flattened = [1, 2, [3, [4]], 5, 123]
        expect(_flatten(inputArray)).toStrictEqual(flattened)
    })
})  
