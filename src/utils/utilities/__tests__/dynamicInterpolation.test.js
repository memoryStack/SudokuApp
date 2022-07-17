
import { dynamicInterpolation } from '../dynamicInterpolation'

describe('dynamicInterpolation()', () => {
    test('returns empty string when non string value is sent', () => {
        expect(dynamicInterpolation(null)).toBe('')
        expect(dynamicInterpolation(undefined)).toBe('')
        expect(dynamicInterpolation(1)).toBe('')
        expect(dynamicInterpolation({ a: 1 })).toBe('')
    })

    test('returns empty string when empty string is sent', () => {
        const placeholdersValues = { a: 1 }
        expect(dynamicInterpolation('', placeholdersValues)).toBe('')
    })

    test('uses {{}} as default patten to identify placeholders in template', () => {
        const template = 'after 0 comes {{one}}'
        const placeholdersValues = { one: 1 }
        expect(dynamicInterpolation(template, placeholdersValues)).toBe('after 0 comes 1')
    })

    test('returns placeholder as it is if value for that placeholder is not given', () => {
        const template = 'after 0 comes {{one}}. and after 1 comes {{two}}'
        const placeholdersValues = { one: 1 }
        expect(dynamicInterpolation(template, placeholdersValues)).toBe('after 0 comes 1. and after 1 comes {{two}}')
    })

    test('uses custom reg-ex pattern to identify placeholders', () => {
        const template = 'after 0 comes #one#. after 1 comes {{two}}'
        const placeholdersValues = { one: 1, two: 2 }
        const pattern = /#(.*?)#/g
        expect(dynamicInterpolation(template, placeholdersValues, pattern)).toBe('after 0 comes 1. after 1 comes {{two}}')
    })
})