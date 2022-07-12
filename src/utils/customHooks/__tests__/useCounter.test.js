import { renderHook, act } from '@testing-library/react-hooks'
import { CounterStepProvider, useCounter } from '../useCounter'

jest.mock('../apis')

beforeAll(() => {
    jest.useFakeTimers()
})

afterAll(() => {
    jest.useRealTimers()
})

test('should use custom step when incrementing', async () => {

    const { fetchStepCount } = require('../apis')

    fetchStepCount.mockImplementation(() => {
        return Promise.resolve(10)
    })

    const { result, rerender, waitForNextUpdate } = renderHook((props) => useCounter(), { wrapper: CounterStepProvider, initialProps: { step: 4 } })

    act(() => {
        result.current.increment()
    })

    expect(result.current.count).toBe(4)

    await waitForNextUpdate()

    act(() => {
        result.current.increment()
    })

    expect(result.current.count).toBe(14)

})

test('should use custom step when incrementing', async () => {

    const { fetchStepCount } = require('../apis')

    fetchStepCount.mockImplementation(() => new Promise((resolve) => { setTimeout(() => { resolve(8) }, 2000) }))

    const { result, rerender, waitForNextUpdate } = renderHook((props) => useCounter(), { wrapper: CounterStepProvider, initialProps: { step: 4 } })

    act(() => {
        result.current.increment()
    })
    expect(result.current.count).toBe(4)

    rerender({ step: 10 })

    act(() => {
        result.current.increment()
    })
    expect(result.current.count).toBe(14)

    jest.advanceTimersByTime(2000)

    await waitForNextUpdate()

    act(() => {
        result.current.increment()
    })
    expect(result.current.count).toBe(22)

})
