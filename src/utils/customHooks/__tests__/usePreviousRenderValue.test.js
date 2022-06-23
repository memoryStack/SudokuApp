import { renderHook } from '@testing-library/react-hooks'

import { usePreviousRenderValue } from "../commonUtility";

describe('usePreviousRenderValue()', () => {
    test('return undefined after first render', () => {
        const { result } = renderHook(({ value }) => usePreviousRenderValue(value), {
            initialProps: { value: 9 }
        })

        expect(result.current).toBeUndefined()
    })

    test('return 9 after second render because in first render we passed 9 as argument', () => {
        const { result, rerender } = renderHook(({ value }) => usePreviousRenderValue(value), {
            initialProps: { value: 9 }
        })

        rerender({ value: 9 })
        expect(result.current).toBe(9)
    })

    test('return 9 after second render and 10 after third render', () => {
        const { result, rerender } = renderHook(({ value }) => usePreviousRenderValue(value), {
            initialProps: { value: 9 }
        })

        rerender({ value: 10 })
        expect(result.current).toBe(9)
        rerender({ value: 11 })
        expect(result.current).toBe(10)
    })
})
