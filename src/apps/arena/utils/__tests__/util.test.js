import { getTimeComponentString } from '../util'

test('getTimeComponentString test 1', () => {
    expect(getTimeComponentString(0)).toBe('00')
})

test('getTimeComponentString test 2', () => {
    expect(getTimeComponentString(11)).toBe('11')
})

test('getTimeComponentString test 3', () => {
    expect(getTimeComponentString(1)).toBe('01')
})
