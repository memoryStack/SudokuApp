import _compact from 'lodash/compact'

describe('_compact()', () => {

    /* _compact(array)    */

    test('returns an array after all the flasey values removed like [null, undefined, empty string, 0, false, NaN]', () => {
        const array = [0, 1, null, false, 2, '', 3, undefined, true, NaN, {}]
        const expectedResult = [1, 2, 3, true, {}]
        expect(_compact(array)).toStrictEqual(expectedResult)
    })

    test('returns a new array even when there are no falsey values in array', () => {
        const array = [1, 2, 3]
        expect(_compact(array)).not.toBe(array)
        expect(_compact(array)).toStrictEqual(array)
    })

    test('returns an empty array when non-empty array is passed', () => {
        expect(_compact(null)).toStrictEqual([])
        expect(_compact(undefined)).toStrictEqual([])
        expect(_compact(0)).toStrictEqual([])
        expect(_compact(false)).toStrictEqual([])
        expect(_compact({})).toStrictEqual([])
    })

})
