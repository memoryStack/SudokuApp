import { renderHook, act } from '@testing-library/react-hooks'

import { useToggle } from '../useToggle'

describe('useToggle()', () => {
    test('returns an array of boolean (toggle state) and function (staste update callback)', () => {
        const { result } = renderHook(({ value }) => useToggle(value), {
            initialProps: { value: false },
        })

        expect(typeof result.current[0]).toBe('boolean')
        expect(typeof result.current[1]).toBe('function')
    })

    test('returns false as toggle state when no initial input is sent to the hook', () => {
        const { result } = renderHook(() => useToggle())
        expect(result.current[0]).toBe(false)
    })

    test('return false after first render as toggle state when initial state is passed as false', () => {
        const { result } = renderHook(({ value }) => useToggle(value), {
            initialProps: { value: false },
        })

        expect(result.current[0]).toBe(false)
    })

    test('toggle value is not changed when in second render input value is changed', () => {
        const { result, rerender } = renderHook(({ value }) => useToggle(value), {
            initialProps: { value: false },
        })

        rerender({ value: true })
        expect(result.current[0]).toBe(false)
    })

    test('toggle state is set to true/false when state toggler is called with boolean argument', () => {
        const { result } = renderHook(({ value }) => useToggle(value), {
            initialProps: { value: false },
        })

        act(() => {
            const toggler = result.current[1]
            toggler(true)
        })
        expect(result.current[0]).toBe(true)

        act(() => {
            const toggler = result.current[1]
            toggler(false)
        })
        expect(result.current[0]).toBe(false)
    })

    test('toggler will toggle the state when non-boolean or no argument is sent to toggler', () => {
        const { result } = renderHook(({ value }) => useToggle(value), {
            initialProps: { value: false },
        })

        act(() => {
            const toggler = result.current[1]
            toggler(123)
        })
        expect(result.current[0]).toBe(true)

        act(() => {
            const toggler = result.current[1]
            toggler('a string')
        })
        expect(result.current[0]).toBe(false)

        act(() => {
            const toggler = result.current[1]
            toggler()
        })
        expect(result.current[0]).toBe(true)
    })
})
