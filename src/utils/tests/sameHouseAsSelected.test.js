import { sameHouseAsSelected } from '../util'

// same block house
test('sameHouseAsSelected func test 1', () => {
    expect(sameHouseAsSelected(0, 0, 1, 1, {row: 0, col: 0}, {row: 1, col: 1})).toBe(true)
})

// same row house
test('sameHouseAsSelected func test 2', () => {
    expect(sameHouseAsSelected( {row: 0, col: 0}, {row: 0, col: 8})).toBe(true)
})

// same col house
test('sameHouseAsSelected func test 3', () => {
    expect(sameHouseAsSelected({row: 2, col: 4}, {row: 6, col: 4})).toBe(true)
})

// different houses tests
test('sameHouseAsSelected func test 4', () => {
    expect(sameHouseAsSelected({row: 0, col: 0}, {row: 6, col: 4})).toBe(false)
})

test('sameHouseAsSelected func test 5', () => {
    expect(sameHouseAsSelected({row: 0, col: 0}, {row: 3, col: 3})).toBe(false)
})

test('sameHouseAsSelected func test 6', () => {
    expect(sameHouseAsSelected({row: 2, col: 2}, {row: 3, col: 3})).toBe(false)
})
