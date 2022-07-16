import _isEmpty from 'lodash/isEmpty'

describe('_isEmpty()', () => {
    test(`returns true when object is passed which doesn't have it's enumerable properties`, () => {
        expect(_isEmpty({})).toBe(true)
    })

    test(`returns fale when object is passed which have some enumerable properties`, () => {
        expect(_isEmpty({ a: '1' })).toBe(false)
    })

    test(`returns true when passed array doesn't have any item in it`, () => {
        expect(_isEmpty([])).toBe(true)
    })

    test(`returns false when passed array has some item in it`, () => {
        expect(_isEmpty([0])).toBe(false)
    })

    test(`returns true when passed map doesn't have any key value pair in it`, () => {
        expect(_isEmpty(new Map())).toBe(true)
    })

    test(`returns false when passed map have some key value pair in it`, () => {
        const map = new Map()
        map.set('a', '1')
        expect(_isEmpty(map)).toBe(false)
    })

    test(`returns true when passed set doesn't have any item in it`, () => {
        expect(_isEmpty(new Set())).toBe(true)
    })

    test(`returns false when passed set have any item in it`, () => {
        const set = new Set()
        set.add('a')
        expect(_isEmpty(set)).toBe(false)
    })

    test(`returns true when a primitive number or NaN is passed`, () => {
        expect(_isEmpty(0)).toBe(true)
        expect(_isEmpty(10)).toBe(true)
        expect(_isEmpty(-10)).toBe(true)
        expect(_isEmpty(NaN)).toBe(true)
    })

    test(`returns true when a number as object is passed`, () => {
        expect(_isEmpty(new Number(12))).toBe(true)
    })

    test(`returns true when a primitive boolean is passed`, () => {
        expect(_isEmpty(true)).toBe(true)
        expect(_isEmpty(false)).toBe(true)
    })

    test(`returns true when a boolean object is passed`, () => {
        expect(_isEmpty(new Boolean(true))).toBe(true)
        expect(_isEmpty(new Boolean(false))).toBe(true)
    })

    test(`returns true when empty string is passed`, () => {
        expect(_isEmpty('')).toBe(true)
    })

    test(`returns false when a primitive string is passed`, () => {
        expect(_isEmpty('0')).toBe(false)
        expect(_isEmpty('abcd')).toBe(false)
    })

    test(`returns true when a empty string object is passed`, () => {
        expect(_isEmpty(new String(''))).toBe(true)
    })

    test(`returns false when a string object with value is passed`, () => {
        expect(_isEmpty(new String('abcd'))).toBe(false)
    })

    test(`returns true when null is passed`, () => {
        expect(_isEmpty(null)).toBe(true)
    })

    test(`returns true when undefined is passed`, () => {
        expect(_isEmpty(undefined)).toBe(true)
    })

    test(`returns true when function is passed`, () => {
        expect(_isEmpty(() => { })).toBe(true)

        const funcWithReturn = () => 1
        expect(_isEmpty(funcWithReturn)).toBe(true)
    })

})
