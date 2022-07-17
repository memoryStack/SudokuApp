import { toOrdinal } from "../toOrdinal";

describe('toOrdinal()', () => {

    test('returns NaNth when input cant be converted to a number', () => {
        expect(toOrdinal(null)).toBe('NaNth')
        expect(toOrdinal(undefined)).toBe('NaNth')
        expect(toOrdinal('1w')).toBe('NaNth')
        expect(toOrdinal({})).toBe('NaNth')
    })

    test('returns number in string form after adding th in the end when number unit digit is neither 1, 2, or 3', () => {
        expect(toOrdinal(0)).toBe('0th')
        expect(toOrdinal(14)).toBe('14th')
        expect(toOrdinal(26)).toBe('26th')
        expect(toOrdinal(100067)).toBe('100067th')
        expect(toOrdinal(-100067)).toBe('-100067th')
    })

    test('returns number in string form after adding st in the end when number ends with 1 but not 11', () => {
        expect(toOrdinal(1)).toBe('1st')
        expect(toOrdinal(21)).toBe('21st')
        expect(toOrdinal(101)).toBe('101st')
        expect(toOrdinal(10041)).toBe('10041st')
    })

    test('returns number in string form after adding th in the end when number ends with 11', () => {
        expect(toOrdinal(11)).toBe('11th')
        expect(toOrdinal(111)).toBe('111th')
        expect(toOrdinal(12311)).toBe('12311th')
    })

    test('returns number in string form after adding nd in the end when number ends with 2 but not 12', () => {
        expect(toOrdinal(2)).toBe('2nd')
        expect(toOrdinal(22)).toBe('22nd')
        expect(toOrdinal(162)).toBe('162nd')
    })

    test('returns number in string form after adding th in the end when number ends with 12', () => {
        expect(toOrdinal(12)).toBe('12th')
        expect(toOrdinal(112)).toBe('112th')
        expect(toOrdinal(12312)).toBe('12312th')
    })

    test('returns number in string form after adding rd in the end when number ends with 3 but not 13', () => {
        expect(toOrdinal(3)).toBe('3rd')
        expect(toOrdinal(23)).toBe('23rd')
        expect(toOrdinal(163)).toBe('163rd')
    })

    test('returns number in string form after adding th in the end when number ends with 13', () => {
        expect(toOrdinal(13)).toBe('13th')
        expect(toOrdinal(113)).toBe('113th')
        expect(toOrdinal(12313)).toBe('12313th')
    })
})
