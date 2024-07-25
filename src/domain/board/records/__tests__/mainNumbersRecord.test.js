import { MainNumbersRecord } from '../mainNumbersRecord'

describe('isCellFilledCorrectly()', () => {
    test('returns false when input value is different than solution value of cell', () => {
        const cell = { row: 0, col: 0 }
        const mainNumbers = [[{ value: 0, solutionValue: 5, isClue: false }]]
        expect(MainNumbersRecord.isCellFilledCorrectly(mainNumbers, cell)).toBeFalsy()
    })

    test('returns true when input value is same as solution value', () => {
        const cell = { row: 0, col: 0 }
        const mainNumbers = [[{ value: 5, solutionValue: 5, isClue: false }]]
        expect(MainNumbersRecord.isCellFilledCorrectly(mainNumbers, cell)).toBeTruthy()
    })

    test('returns false if no arguments are passed', () => {
        expect(MainNumbersRecord.isCellFilledCorrectly()).toBeFalsy()
    })

    test('returns false if neither input is present nor solution value', () => {
        const cell = { row: 0, col: 0 }
        const mainNumbers = [[{ value: 0, solutionValue: 0, isClue: false }]]
        expect(MainNumbersRecord.isCellFilledCorrectly(mainNumbers, cell)).toBeFalsy()
    })

    test('returns false if input field is not present at all', () => {
        const cell = { row: 0, col: 0 }
        const mainNumbers = [[{ solutionValue: 5, isClue: false }]]
        expect(MainNumbersRecord.isCellFilledCorrectly(mainNumbers, cell)).toBeFalsy()
    })
})
