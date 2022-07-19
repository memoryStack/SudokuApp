import _chunk from 'lodash/chunk'

describe('_chunk()', () => {

    /**
        _.chunk(array, [size=1])
            size argument is optional here
     */

    test('returns a new array always even if transformation is not needed', () => {
        const emptyInput = []
        expect(_chunk(emptyInput)).not.toBe(emptyInput)

        const inputWithValues = [1, 2]
        expect(_chunk(inputWithValues, 2)).not.toBe(inputWithValues)
    })

    test('returns an array of arrays of size 1 having each child of orignal array as their element', () => {
        const input = [1, 2, 3, 4]
        const expectedResult = [[1], [2], [3], [4]]
        expect(_chunk(input)).toStrictEqual(expectedResult)
    })

    test('returns an array of arrays where length of subarrays are determined by second argument', () => {
        const input = [1, 2, 3, 4]
        const expectedResult = [[1, 2], [3, 4]]
        expect(_chunk(input, 2)).toStrictEqual(expectedResult)

    })

    test('returns an array of arrays where last subarray has less elements if all subarrays cant have even elements', () => {
        const input = [1, 2, 3, 4]
        const expectedResult = [[1, 2, 3], [4]]
        expect(_chunk(input, 3)).toStrictEqual(expectedResult)
    })

    test('returns an array with only one array if subarray size > original array length', () => {
        const input = [1, 2, 3, 4]
        const expectedResult = [[1, 2, 3, 4]]
        expect(_chunk(input, 5)).toStrictEqual(expectedResult)
    })

    test('when size argument is positive float number then returns subarrays of length = floor(requested size)', () => {
        const input = [1, 2, 3, 4]

        expect(_chunk(input, 1.2)).toStrictEqual([[1], [2], [3], [4]])
        expect(_chunk(input, 3.4)).toStrictEqual([[1, 2, 3], [4]])
        expect(_chunk(input, 0.99)).toStrictEqual([])
    })

    test('returns an array of arrays of size 1 having each child of orignal array as their element when size argument is undefined', () => {
        const input = [1, 2, 3, 4]
        const expectedResult = [[1], [2], [3], [4]]
        expect(_chunk(input, undefined)).toStrictEqual(expectedResult)
    })

    test('returns an empty array [] when size argument is one of [null, alphabetical string, 0, negative number, NaN]', () => {
        const input = [1, 2, 3, 4]

        expect(_chunk(input, null)).toStrictEqual([])
        expect(_chunk(input, 'a')).toStrictEqual([])
        expect(_chunk(input, 0)).toStrictEqual([])
        expect(_chunk(input, -1)).toStrictEqual([])
        expect(_chunk(input, NaN)).toStrictEqual([])
    })

    test('when passed array is string then it considers it as an array with string characters as the elements of array', () => {
        const input = 'qwerty'

        expect(_chunk(input, 1)).toStrictEqual([['q'], ['w'], ['e'], ['r'], ['t'], ['y']])
        expect(_chunk(input, 3)).toStrictEqual([['q', 'w', 'e'], ['r', 't', 'y']])
    })

    test('returns an empty array [] when input argument is not a valid array', () => {
        expect(_chunk(null)).toStrictEqual([])
        expect(_chunk(undefined)).toStrictEqual([])
        expect(_chunk(123)).toStrictEqual([])
        expect(_chunk({ a: 1 })).toStrictEqual([])
        expect(_chunk(true)).toStrictEqual([])
    })
})