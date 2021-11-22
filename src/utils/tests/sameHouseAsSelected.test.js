import { sameHouseAsSelected } from "../util";

// same block house
test("sameHouseAsSelected func test 1", () => {
    expect(sameHouseAsSelected(0, 0, 1, 1)).toBe(true)
})

// same row house
test("sameHouseAsSelected func test 2", () => {
    expect(sameHouseAsSelected(0, 0, 0, 8)).toBe(true)
})

// same col house
test("sameHouseAsSelected func test 3", () => {
    expect(sameHouseAsSelected(2, 4, 6, 4)).toBe(true)
})

// different houses tests
test("sameHouseAsSelected func test 4", () => {
    expect(sameHouseAsSelected(0, 0, 6, 4)).toBe(false)
})

test("sameHouseAsSelected func test 5", () => {
    expect(sameHouseAsSelected(0, 0, 3, 3)).toBe(false)
})

test("sameHouseAsSelected func test 6", () => {
    expect(sameHouseAsSelected(2, 2, 3, 3)).toBe(false)
})
