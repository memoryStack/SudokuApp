import { renderHook } from '@testing-library/react-hooks'

import { usePrevious } from "../commonUtility";

describe('usePrevious()', () => {
    test('return undefined until input value is not changed because undefined is the previous value and 9 is the current value', () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
            initialProps: { value: 9 }
        })

        expect(result.current).toBe(undefined)
        rerender({ value: 9 })
        expect(result.current).toBe(undefined)
    })

    test('returns 9 when input value is changed from 9 to 10', () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
            initialProps: { value: 9 }
        })

        rerender({ value: 10 })
        expect(result.current).toBe(9)
    })
})
